import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type AnalyticsEventType =
  | 'VISITOR'
  | 'QUOTE_START'
  | 'QUOTE_COMPLETION'
  | 'LEAD_CREATED'
  | 'QUOTE_CREATED'
  | 'APPLICATION_CREATED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'POLICY_ISSUED';

export interface TrackEventInput {
  eventType: AnalyticsEventType;
  source?: string;
  productType?: string;
  insurerId?: string;
  partnerId?: string;
  salesStaffId?: string;
  customerId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeMetadata(metadata?: Record<string, any>) {
    if (!metadata) return {};

    const sanitized = { ...metadata };
    delete sanitized.name;
    delete sanitized.email;
    delete sanitized.phone;
    delete sanitized.nin;
    delete sanitized.kyc;
    delete sanitized.customerProfile;
    delete sanitized.documents;
    delete sanitized.personalDetails;
    return sanitized;
  }

  async trackEvent(input: TrackEventInput) {
    return this.prisma.analyticsEvent.create({
      data: {
        eventType: input.eventType,
        source: input.source || 'unknown',
        productType: input.productType || null,
        insurerId: input.insurerId || null,
        partnerId: input.partnerId || null,
        salesStaffId: input.salesStaffId || null,
        customerId: input.customerId || null,
        metadata: this.sanitizeMetadata(input.metadata),
      },
    });
  }

  async getCustomerFunnel(filters: { startDate?: Date; endDate?: Date; product?: string; insurerId?: string; partnerId?: string; salesStaffId?: string; source?: string } = {}) {
    const baseWhere = this.buildWhere(filters);

    const visitors = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'VISITOR' } });
    const quoteStart = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_START' } });
    const quoteCompletion = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_COMPLETION' } });
    const lead = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'LEAD_CREATED' } });
    const quote = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_CREATED' } });
    const application = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'APPLICATION_CREATED' } });
    const payment = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'PAYMENT_SUCCESS' } });
    const policyIssued = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'POLICY_ISSUED' } });

    const conversionRate = quoteStart > 0 ? (policyIssued / quoteStart) * 100 : 0;

    return {
      visitors,
      quoteStart,
      quoteCompletion,
      lead,
      quote,
      application,
      payment,
      policyIssued,
      conversionRate: Number(conversionRate.toFixed(2)),
    };
  }

  async getAdminDashboard(filters: any = {}) {
    const baseWhere = this.buildWhere(filters);
    const [leads, quotes, applications, policies, premium, commission] = await Promise.all([
      this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'LEAD_CREATED' } }),
      this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_CREATED' } }),
      this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'APPLICATION_CREATED' } }),
      this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'POLICY_ISSUED' } }),
      this.getMetricTotal(baseWhere, 'premium'),
      this.getMetricTotal(baseWhere, 'commission'),
    ]);

    return {
      leads,
      quotes,
      applications,
      policies,
      premium,
      commission,
    };
  }

  async getBusinessAnalytics(filters: any = {}) {
    const baseWhere = this.buildWhere(filters);
    const policyVolume = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'POLICY_ISSUED' } });
    const premiumFacilitated = await this.getMetricTotal(baseWhere, 'premium');
    const commission = await this.getMetricTotal(baseWhere, 'commission');
    const claimsVolume = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'CLAIM_CREATED' } });

    return {
      policyVolume,
      premiumFacilitated,
      commission,
      CAC: 0,
      contributionPerPolicy: policyVolume > 0 ? Number(((commission || 0) / policyVolume).toFixed(2)) : 0,
      insurerConversion: 0,
      productConversion: 0,
      partnerConversion: 0,
      salesStaffConversion: 0,
      renewalRate: 0,
      claimsVolume,
    };
  }

  async getInsurerAnalytics(filters: any = {}) {
    const baseWhere = this.buildWhere(filters);
    const quotesRequested = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_START' } });
    const quotesReturned = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_COMPLETION' } });
    const quoteFailures = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_FAILURE' } });
    const applications = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'APPLICATION_CREATED' } });
    const policies = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'POLICY_ISSUED' } });
    const premium = await this.getMetricTotal(baseWhere, 'premium');
    const commission = await this.getMetricTotal(baseWhere, 'commission');
    const conversion = quotesRequested > 0 ? (policies / quotesRequested) * 100 : 0;

    return {
      quotesRequested,
      quotesReturned,
      quoteFailures,
      applications,
      policies,
      conversion: Number(conversion.toFixed(2)),
      premium,
      commission,
    };
  }

  async getPartnerAnalytics(filters: any = {}) {
    const baseWhere = this.buildWhere(filters);
    const leads = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'LEAD_CREATED' } });
    const quotes = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'QUOTE_CREATED' } });
    const policies = await this.prisma.analyticsEvent.count({ where: { ...baseWhere, eventType: 'POLICY_ISSUED' } });
    const premium = await this.getMetricTotal(baseWhere, 'premium');
    const commission = await this.getMetricTotal(baseWhere, 'commission');
    const conversion = leads > 0 ? (policies / leads) * 100 : 0;

    return {
      leads,
      quotes,
      policies,
      conversion: Number(conversion.toFixed(2)),
      premium,
      commission,
    };
  }

  async exportCsv(filters: any = {}) {
    const rows = await this.prisma.analyticsEvent.findMany({
      where: this.buildWhere(filters),
      orderBy: { createdAt: 'desc' },
    });

    const header = ['eventType', 'source', 'productType', 'insurerId', 'partnerId', 'salesStaffId', 'customerId', 'createdAt'];
    const csv = [
      header.join(','),
      ...rows.map((row) => [
        row.eventType,
        row.source,
        row.productType || '',
        row.insurerId || '',
        row.partnerId || '',
        row.salesStaffId || '',
        row.customerId || '',
        row.createdAt.toISOString(),
      ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return { csv, fileName: 'khaacho-analytics.csv' };
  }

  private buildWhere(filters: any) {
    const where: any = {};

    if (filters.dateRange?.start || filters.startDate) {
      where.createdAt = {
        gte: filters.dateRange?.start || filters.startDate,
      };
    }

    if (filters.dateRange?.end || filters.endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: filters.dateRange?.end || filters.endDate,
      };
    }

    if (filters.product) {
      where.productType = filters.product;
    }

    if (filters.insurer) {
      where.insurerId = filters.insurer;
    }

    if (filters.partner) {
      where.partnerId = filters.partner;
    }

    if (filters.salesStaff) {
      where.salesStaffId = filters.salesStaff;
    }

    if (filters.source) {
      where.source = filters.source;
    }

    return where;
  }

  private async getMetricTotal(where: any, key: 'premium' | 'commission') {
    const rows = await this.prisma.analyticsEvent.findMany({
      where,
      select: { metadata: true },
    });

    return rows.reduce((sum, row) => {
      const value = Number((row.metadata as Record<string, any>)?.[key] ?? 0);
      return sum + value;
    }, 0);
  }
}
