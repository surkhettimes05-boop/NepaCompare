import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RenewalAnalyticsSummary, RenewalReminderConfigItem, RenewalState } from './renewals.types';

@Injectable()
export class RenewalsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultReminderSchedule: RenewalReminderConfigItem[] = [
    { name: '90_days', daysBefore: 90, active: true },
    { name: '60_days', daysBefore: 60, active: true },
    { name: '30_days', daysBefore: 30, active: true },
    { name: '15_days', daysBefore: 15, active: true },
    { name: '7_days', daysBefore: 7, active: true },
    { name: '3_days', daysBefore: 3, active: true },
    { name: '1_day', daysBefore: 1, active: true },
    { name: 'expiry_day', daysBefore: 0, active: true },
    { name: 'post_expiry_follow_up', daysBefore: -1, active: true },
  ];

  async ensureRenewalForPolicy(policyId: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    if (!policy.expiryDate) {
      throw new Error('Policy expiry date is required for renewal management');
    }

    const existing = await this.prisma.renewal.findFirst({ where: { policyId } });
    if (existing) {
      return existing;
    }

    const renewalDate = new Date(policy.expiryDate);
    const reminderSchedule = this.defaultReminderSchedule.map(item => ({
      ...item,
      triggerAt: new Date(renewalDate.getTime() - item.daysBefore * 24 * 60 * 60 * 1000),
    }));

    const renewal = await this.prisma.renewal.create({
      data: {
        policyId,
        renewalDate,
        status: 'UPCOMING',
        reminderSchedule,
        nextReminderAt: reminderSchedule[0]?.triggerAt || renewalDate,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'RENEWAL_CREATED',
        entityType: 'Renewal',
        entityId: renewal.id,
        before: null,
        after: {
          policyId,
          renewalDate,
          status: 'UPCOMING',
        },
      },
    });

    return renewal;
  }

  async getRenewalsDashboard() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const [due, today, thisWeek, overdue, renewed, lost] = await Promise.all([
      this.prisma.renewal.count({
        where: {
          nextReminderAt: { lte: now },
          status: { in: ['UPCOMING', 'CONTACT_PENDING', 'CONTACTED', 'QUOTE_REQUESTED', 'QUOTE_RECEIVED', 'CUSTOMER_DECIDING'] },
        },
      }),
      this.prisma.renewal.count({
        where: {
          renewalDate: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
            lt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
          },
        },
      }),
      this.prisma.renewal.count({
        where: { renewalDate: { gte: startOfWeek, lt: endOfWeek } },
      }),
      this.prisma.renewal.count({ where: { status: 'EXPIRED' } }),
      this.prisma.renewal.count({ where: { status: 'RENEWED' } }),
      this.prisma.renewal.count({ where: { status: 'LOST' } }),
    ]);

    return {
      renewalsDue: due,
      renewalsToday: today,
      renewalsThisWeek: thisWeek,
      overdue,
      renewed,
      lost,
    };
  }

  async getRenewalAnalytics(): Promise<RenewalAnalyticsSummary> {
    const [total, renewed, contacted, quoted, premiumTotal, commissionTotal] = await Promise.all([
      this.prisma.renewal.count(),
      this.prisma.renewal.count({ where: { status: 'RENEWED' } }),
      this.prisma.renewal.count({ where: { status: { in: ['CONTACTED', 'QUOTE_REQUESTED', 'QUOTE_RECEIVED', 'CUSTOMER_DECIDING', 'RENEWED'] } } }),
      this.prisma.renewal.count({ where: { status: { in: ['QUOTE_REQUESTED', 'QUOTE_RECEIVED', 'CUSTOMER_DECIDING', 'RENEWED'] } } }),
      this.prisma.renewal.aggregate({ _sum: { renewalPremium: true } }),
      this.prisma.renewal.aggregate({ _sum: { renewalCommission: true } }),
    ]);

    const renewalRate = total > 0 ? (renewed / total) * 100 : 0;
    const contactedRate = total > 0 ? (contacted / total) * 100 : 0;
    const quoteRate = total > 0 ? (quoted / total) * 100 : 0;
    const renewalConversion = total > 0 ? (renewed / Math.max(contacted, 1)) * 100 : 0;

    return {
      renewalRate: Number(renewalRate.toFixed(2)),
      contactedRate: Number(contactedRate.toFixed(2)),
      quoteRate: Number(quoteRate.toFixed(2)),
      renewalConversion: Number(renewalConversion.toFixed(2)),
      renewalPremium: Number((premiumTotal._sum.renewalPremium || 0).toFixed(2)),
      renewalCommission: Number((commissionTotal._sum.renewalCommission || 0).toFixed(2)),
    };
  }

  async scheduleReminder(policyId: string, reminderSet?: RenewalReminderConfigItem[]) {
    const renewal = await this.ensureRenewalForPolicy(policyId);
    const schedule = (reminderSet || this.defaultReminderSchedule).map(item => ({
      ...item,
      triggerAt: new Date(new Date(renewal.renewalDate).getTime() - item.daysBefore * 24 * 60 * 60 * 1000),
    }));

    await this.prisma.renewal.update({
      where: { id: renewal.id },
      data: { reminderSchedule: schedule, nextReminderAt: schedule[0]?.triggerAt || renewal.renewalDate },
    });

    return { renewalId: renewal.id, reminderSchedule: schedule };
  }

  async queueReminderJob(renewalId: string, jobType: string, scheduleKey?: string) {
    const renewal = await this.prisma.renewal.findUnique({ where: { id: renewalId } });
    if (!renewal) {
      throw new NotFoundException('Renewal not found');
    }

    const idempotencyKey = `${renewalId}:${jobType}:${scheduleKey || 'default'}`;
    const existing = await this.prisma.renewalJob.findUnique({ where: { idempotencyKey } });
    if (existing) {
      return existing;
    }

    return this.prisma.renewalJob.create({
      data: {
        renewalId,
        jobType,
        scheduleKey: scheduleKey || 'default',
        status: 'PENDING',
        idempotencyKey,
        nextRunAt: new Date(),
      },
    });
  }

  async markRenewalStatus(renewalId: string, status: RenewalState, actorId?: string) {
    const renewal = await this.prisma.renewal.findUnique({ where: { id: renewalId } });
    if (!renewal) {
      throw new NotFoundException('Renewal not found');
    }

    const updated = await this.prisma.renewal.update({
      where: { id: renewalId },
      data: { status },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        action: 'RENEWAL_STATUS_UPDATED',
        entityType: 'Renewal',
        entityId: renewalId,
        before: { status: renewal.status },
        after: { status },
      },
    });

    return updated;
  }

  async createNotification(renewalId: string, channel: string, provider?: string, payload?: Record<string, any>) {
    const renewal = await this.prisma.renewal.findUnique({ where: { id: renewalId } });
    if (!renewal) {
      throw new NotFoundException('Renewal not found');
    }

    return this.prisma.renewalNotification.create({
      data: {
        renewalId,
        channel,
        provider: provider || null,
        status: 'QUEUED',
        payload: payload || {},
      },
    });
  }

  async recordNotificationDelivery(notificationId: string, providerMessageId?: string) {
    return this.prisma.renewalNotification.update({
      where: { id: notificationId },
      data: {
        status: 'DELIVERED',
        delivered: true,
        deliveredAt: new Date(),
        providerMessageId: providerMessageId || null,
      },
    });
  }

  async listRenewalsForPolicy(policyId: string) {
    return this.prisma.renewal.findMany({
      where: { policyId },
      orderBy: { renewalDate: 'asc' },
    });
  }

  async getPoliciesForUser(userId: string) {
    return this.prisma.policy.findMany({
      where: { customerId: userId },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async getAllExpiringPolicies() {
    return this.prisma.renewal.findMany({
      orderBy: { nextReminderAt: 'asc' },
      include: { policy: true },
    });
  }

  async renewPolicy(policyId: string, userId: string) {
    const policy = await this.prisma.policy.findUnique({ where: { id: policyId } });
    if (!policy || policy.customerId !== userId) {
      throw new Error('Policy not found or unauthorized');
    }

    const renewal = await this.ensureRenewalForPolicy(policyId);
    await this.markRenewalStatus(renewal.id, 'RENEWED', userId);

    return {
      policyId,
      renewalId: renewal.id,
      status: 'RENEWED',
    };
  }
}
