import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  private ensurePartnerAccess(requestUser: any, partnerId: string) {
    if (!requestUser) {
      throw new ForbiddenException('Authentication required');
    }

    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS'].includes(requestUser.role);
    const isPartnerOwner = requestUser.partnerId === partnerId;

    if (!isAdmin && !isPartnerOwner) {
      throw new ForbiddenException('You can only access your own partner resources');
    }
  }

  async create(createPartnerDto: CreatePartnerDto) {
    const referralCode = `KHAACHO-${(Math.random() + 1).toString(36).slice(2, 8).toUpperCase()}`;

    const partner = await this.prisma.partner.create({
      data: {
        displayName: createPartnerDto.displayName,
        legalName: createPartnerDto.legalName,
        type: createPartnerDto.type,
        status: createPartnerDto.status ?? 'PROSPECT',
        businessType: createPartnerDto.businessType,
        contactName: createPartnerDto.contactName,
        contactPhone: createPartnerDto.contactPhone,
        contactEmail: createPartnerDto.contactEmail,
        verticals: createPartnerDto.verticals ?? [],
        regions: createPartnerDto.regions ?? [],
        agreedCpl: createPartnerDto.agreedCpl ?? 0,
        active: createPartnerDto.active ?? true,
        referralCode,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PARTNER_CREATED',
        entityType: 'Partner',
        entityId: partner.id,
        before: null,
        after: {
          displayName: partner.displayName,
          type: partner.type,
          status: partner.status,
          referralCode: partner.referralCode,
        },
      },
    });

    return partner;
  }

  findAll() {
    return this.prisma.partner.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.partner.findUnique({
      where: { id },
      include: {
        leads: true,
        users: true,
        commissions: true,
      },
    });
  }

  async findByReferralCode(referralCode: string) {
    return this.prisma.partner.findUnique({
      where: { referralCode },
    });
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const existing = await this.prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Partner not found');
    }

    const updated = await this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto as any,
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PARTNER_UPDATED',
        entityType: 'Partner',
        entityId: id,
        before: {
          displayName: existing.displayName,
          status: existing.status,
          type: existing.type,
        },
        after: {
          displayName: updated.displayName,
          status: updated.status,
          type: updated.type,
        },
      },
    });

    return updated;
  }

  async remove(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    await this.prisma.partner.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'OFFBOARDED', active: false },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PARTNER_OFFBOARDED',
        entityType: 'Partner',
        entityId: id,
        before: { status: partner.status, active: partner.active },
        after: { status: 'OFFBOARDED', active: false },
      },
    });

    return { id, status: 'OFFBOARDED' };
  }

  async getPartnerMetrics(partnerId: string) {
    const [leads, quotes, applications, policies, commissions] = await Promise.all([
      this.prisma.lead.count({ where: { partnerId } }),
      this.prisma.quote.count({ where: { partnerId } }),
      this.prisma.application.count({ where: { partnerId } }),
      this.prisma.policy.count({ where: { partnerId } }),
      this.prisma.commission.findMany({ where: { partnerId } }),
    ]);

    const premium = policies
      ? (await this.prisma.policy.findMany({ where: { partnerId }, select: { premium: true } })).reduce((sum, policy) => sum + Number(policy.premium || 0), 0)
      : 0;

    const commission = commissions.reduce((sum, commissionRow) => sum + Number(commissionRow.commissionAmount || 0), 0);
    const conversionRate = quotes > 0 ? (applications / quotes) * 100 : 0;

    return {
      leads,
      quotes,
      applications,
      policies,
      premium: Number(premium.toFixed(2)),
      commission: Number(commission.toFixed(2)),
      conversionRate: Number(conversionRate.toFixed(2)),
    };
  }

  async getPartnerDashboard(partnerId: string, requestUser?: any) {
    this.ensurePartnerAccess(requestUser, partnerId);

    const [partner, metrics] = await Promise.all([
      this.prisma.partner.findUnique({ where: { id: partnerId } }),
      this.getPartnerMetrics(partnerId),
    ]);

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    return {
      partner: {
        id: partner.id,
        displayName: partner.displayName,
        type: partner.type,
        status: partner.status,
        referralCode: partner.referralCode,
      },
      metrics,
    };
  }

  async getPartnerLeads(partnerId: string, requestUser?: any) {
    this.ensurePartnerAccess(requestUser, partnerId);
    return this.prisma.lead.findMany({
      where: { partnerId },
      include: { customer: true, partner: true, staff: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPartnerCustomers(partnerId: string, requestUser?: any) {
    this.ensurePartnerAccess(requestUser, partnerId);

    const leadCustomers = await this.prisma.lead.findMany({
      where: { partnerId },
      select: { customerId: true },
    });

    const customerIds = [...new Set(leadCustomers.map((row) => row.customerId).filter(Boolean) as string[])];

    if (customerIds.length === 0) {
      return [];
    }

    return this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
      include: { user: true },
    });
  }

  async getPartnerPolicies(partnerId: string, requestUser?: any) {
    this.ensurePartnerAccess(requestUser, partnerId);
    return this.prisma.policy.findMany({
      where: { partnerId },
      include: { customer: true, insurer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPartnerCommissions(partnerId: string, requestUser?: any) {
    this.ensurePartnerAccess(requestUser, partnerId);
    return this.prisma.commission.findMany({
      where: { partnerId },
      include: { policy: true, insurer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPartnerPerformance(partnerId: string, requestUser?: any) {
    this.ensurePartnerAccess(requestUser, partnerId);
    return this.getPartnerMetrics(partnerId);
  }

  async assignLeadAttribution(leadId: string, partnerId: string, actorId?: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const partner = await this.prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: { partnerId },
      });

      await tx.partnerLead.upsert({
        where: { partnerId_leadId: { partnerId, leadId } },
        create: {
          partnerId,
          leadId,
          status: 'ATTRIBUTED',
          attributionData: {
            attributedAt: new Date().toISOString(),
            attributedBy: actorId || null,
          },
        },
        update: {
          status: 'ATTRIBUTED',
          attributionData: {
            ...(updatedLead as any),
            attributedAt: new Date().toISOString(),
            attributedBy: actorId || null,
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: actorId || null,
          action: 'PARTNER_ATTRIBUTION_UPDATED',
          entityType: 'Lead',
          entityId: leadId,
          before: { partnerId: lead.partnerId },
          after: { partnerId, attribution: 'lead' },
        },
      });

      return updatedLead;
    });

    return updated;
  }
}
