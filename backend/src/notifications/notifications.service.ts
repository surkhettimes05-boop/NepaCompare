import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  NotificationChannel,
  NotificationEventType,
  NotificationProvider,
  SendNotificationRequest,
} from './notification-provider.interface';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATION_PROVIDERS') private readonly providers: NotificationProvider[] = [],
  ) {}

  private getProvider(channel: NotificationChannel): NotificationProvider | undefined {
    return this.providers.find((provider) => provider.canHandle(channel));
  }

  private async isDuplicate(request: SendNotificationRequest): Promise<boolean> {
    const existing = await this.prisma.notification.findFirst({
      where: {
        eventType: request.eventType as any,
        recipient: request.recipient,
        template: request.template,
        customerId: request.customerId || null,
        userId: request.userId || null,
      },
    });

    return !!existing;
  }

  async setPreference(customerId: string, channel: NotificationChannel, enabled: boolean) {
    const existing = await this.prisma.notificationPreference.findUnique({
      where: { customerId_channel: { customerId, channel: channel as any } },
    });

    if (existing) {
      return this.prisma.notificationPreference.update({
        where: { id: existing.id },
        data: { enabled },
      });
    }

    return this.prisma.notificationPreference.create({
      data: { customerId, channel: channel as any, enabled },
    });
  }

  async getPreferences(customerId: string) {
    return this.prisma.notificationPreference.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async send(request: SendNotificationRequest) {
    if (await this.isDuplicate(request)) {
      this.logger.warn(`Duplicate notification suppressed for template ${request.template}`);
      return { suppressed: true, reason: 'duplicate' };
    }

    const preference = request.customerId
      ? await this.prisma.notificationPreference.findUnique({
          where: { customerId_channel: { customerId: request.customerId, channel: request.channel as any } },
        })
      : null;

    if (preference && !preference.enabled) {
      return { suppressed: true, reason: 'preference-disabled' };
    }

    const provider = this.getProvider(request.channel);
    if (!provider) {
      throw new NotFoundException(`No notification provider found for channel ${request.channel}`);
    }

    const queued = await this.prisma.notification.create({
      data: {
        customerId: request.customerId || null,
        userId: request.userId || null,
        eventType: request.eventType as any,
        channel: request.channel as any,
        template: request.template,
        recipient: request.recipient,
        provider: provider.providerName,
        status: 'QUEUED',
        deliveryStatus: 'QUEUED',
        payload: request.payload || {},
      },
    });

    try {
      const result = await provider.send(request);

      const notification = await this.prisma.notification.update({
        where: { id: queued.id },
        data: {
          providerReference: result.providerReference || null,
          status: result.accepted ? 'SENT' : 'FAILED',
          deliveryStatus: result.status,
          sentAt: result.accepted ? new Date() : null,
          failedAt: !result.accepted ? new Date() : null,
          lastError: !result.accepted ? 'Provider rejected the send request' : null,
        },
      });

      if (!result.accepted) {
        this.logger.warn(`Notification rejected by provider (${provider.providerName})`);
      }

      return notification;
    } catch (error: any) {
      await this.prisma.notification.update({
        where: { id: queued.id },
        data: {
          status: 'RETRYING',
          deliveryStatus: 'FAILED',
          lastError: error?.message || 'Notification send failed',
          nextAttemptAt: new Date(Date.now() + 60_000),
          attemptCount: { increment: 1 },
        },
      });

      return { queued: true, error: error?.message || 'Notification send failed' };
    }
  }

  async retryFailedNotifications() {
    const notifications = await this.prisma.notification.findMany({
      where: {
        status: { in: ['RETRYING', 'QUEUED'] },
        OR: [
          { nextAttemptAt: null },
          { nextAttemptAt: { lte: new Date() } },
        ],
      },
    });

    for (const notification of notifications) {
      if ((notification.attemptCount || 0) >= (notification.maxAttempts || 3)) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { status: 'FAILED', deliveryStatus: 'FAILED', failedAt: new Date() },
        });
        continue;
      }

      const provider = this.getProvider(notification.channel as NotificationChannel);
      if (!provider) {
        continue;
      }

      const request: SendNotificationRequest = {
        eventType: notification.eventType as NotificationEventType,
        template: notification.template,
        channel: notification.channel as NotificationChannel,
        recipient: notification.recipient,
        payload: (notification.payload as Record<string, any>) || {},
        customerId: notification.customerId || undefined,
        userId: notification.userId || undefined,
      };

      try {
        const result = await provider.send(request);
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            providerReference: result.providerReference || null,
            status: result.accepted ? 'SENT' : 'FAILED',
            deliveryStatus: result.status,
            sentAt: result.accepted ? new Date() : null,
            failedAt: !result.accepted ? new Date() : null,
            nextAttemptAt: null,
            lastError: result.accepted ? null : 'Provider retry rejected',
          },
        });
      } catch (error: any) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            status: 'RETRYING',
            deliveryStatus: 'FAILED',
            lastError: error?.message || 'Retry failed',
            attemptCount: { increment: 1 },
            nextAttemptAt: new Date(Date.now() + 60_000),
          },
        });
      }
    }
  }
}
