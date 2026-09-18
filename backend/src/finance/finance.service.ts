import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type CommissionStatus =
  | 'PENDING'
  | 'CALCULATED'
  | 'APPROVED'
  | 'PAID'
  | 'RECONCILED'
  | 'DISPUTED';

export type FinanceAdjustmentType = 'ADJUSTMENT' | 'DISPUTE' | 'CLAWBACK';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDecimal(value: number | string | undefined | null): number {
    return Number(Number(value ?? 0).toFixed(2));
  }

  async createCommissionRecord(input: {
    policyId: string;
    insurerId?: string;
    partnerId?: string;
    premium: number;
    commissionRate: number;
    status?: CommissionStatus;
  }) {
    const premium = this.normalizeDecimal(input.premium);
    const commissionRate = Number(input.commissionRate ?? 0);
    const commissionAmount = this.normalizeDecimal((premium * commissionRate) / 100);
    const expectedCommission = commissionAmount;
    const receivedCommission = 0;

    const record = await this.prisma.commission.create({
      data: {
        policyId: input.policyId,
        insurerId: input.insurerId ?? null,
        partnerId: input.partnerId ?? null,
        grossPremium: premium,
        commissionRate,
        commissionAmount,
        status: (input.status ?? 'CALCULATED') as any,
        reconciliationData: {
          premiumFacilitated: premium,
          commissionRate,
          expectedCommission,
          receivedCommission,
          outstandingCommission: this.normalizeDecimal(Math.max(expectedCommission - receivedCommission, 0)),
          adjustments: [],
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'COMMISSION_RECORD_CREATED',
        entityType: 'Commission',
        entityId: record.id,
        before: null,
        after: {
          policyId: input.policyId,
          premiumFacilitated: premium,
          commissionRate,
          commissionAmount,
          expectedCommission,
          receivedCommission,
          status: input.status ?? 'CALCULATED',
        },
      },
    });

    return record;
  }

  async recordAdjustment(commissionId: string, input: {
    type: FinanceAdjustmentType;
    amount: number;
    notes?: string;
    actorId?: string;
  }) {
    const commission = await this.prisma.commission.findUnique({ where: { id: commissionId } });
    if (!commission) {
      throw new NotFoundException('Commission record not found');
    }

    const reconciliation = (commission.reconciliationData as Record<string, any>) || {};
    const expectedCommission = this.normalizeDecimal(reconciliation.expectedCommission ?? commission.commissionAmount ?? 0);
    const receivedCommission = this.normalizeDecimal(reconciliation.receivedCommission ?? 0);
    const adjustmentAmount = this.normalizeDecimal(input.amount);
    const nextReceived = this.normalizeDecimal(receivedCommission + adjustmentAmount);
    const nextStatus: CommissionStatus = input.type === 'CLAWBACK'
      ? 'DISPUTED'
      : nextReceived >= expectedCommission
        ? 'RECONCILED'
        : 'PAID';

    const adjustments = Array.isArray(reconciliation.adjustments) ? [...reconciliation.adjustments] : [];
    adjustments.push({
      type: input.type,
      amount: adjustmentAmount,
      notes: input.notes || '',
      actorId: input.actorId || null,
      timestamp: new Date().toISOString(),
    });

    const updated = await this.prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: nextStatus as any,
        reconciliationData: {
          ...reconciliation,
          expectedCommission,
          receivedCommission: nextReceived,
          outstandingCommission: this.normalizeDecimal(Math.max(expectedCommission - nextReceived, 0)),
          adjustments,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: input.actorId || null,
        action: 'COMMISSION_ADJUSTMENT_RECORDED',
        entityType: 'Commission',
        entityId: commissionId,
        before: {
          status: commission.status,
          receivedCommission,
          expectedCommission,
        },
        after: {
          status: nextStatus,
          receivedCommission: nextReceived,
          expectedCommission,
          adjustmentType: input.type,
          notes: input.notes || '',
        },
      },
    });

    return updated;
  }

  async getFinanceDashboard() {
    const rows = await this.prisma.commission.findMany();

    const premiumFacilitated = rows.reduce((sum, row) => {
      const payload = (row.reconciliationData as Record<string, any>) || {};
      return sum + Number(row.grossPremium ?? payload.premiumFacilitated ?? 0);
    }, 0);

    const expectedCommission = rows.reduce((sum, row) => {
      const payload = (row.reconciliationData as Record<string, any>) || {};
      return sum + Number(payload.expectedCommission ?? row.commissionAmount ?? 0);
    }, 0);

    const receivedCommission = rows.reduce((sum, row) => {
      const payload = (row.reconciliationData as Record<string, any>) || {};
      return sum + Number(payload.receivedCommission ?? 0);
    }, 0);

    const disputedCommission = rows
      .filter((row) => row.status === 'DISPUTED')
      .reduce((sum, row) => {
        const payload = (row.reconciliationData as Record<string, any>) || {};
        return sum + Number(payload.expectedCommission ?? row.commissionAmount ?? 0);
      }, 0);

    const clawbacks = rows
      .filter((row) => (row.reconciliationData as Record<string, any>)?.adjustments?.some((entry: any) => entry.type === 'CLAWBACK'))
      .reduce((sum, row) => {
        const payload = (row.reconciliationData as Record<string, any>) || {};
        const adjustments = Array.isArray(payload.adjustments) ? payload.adjustments : [];
        const totalClawbacks = adjustments
          .filter((entry: any) => entry.type === 'CLAWBACK')
          .reduce((inner, entry) => inner + Number(entry.amount ?? 0), 0);
        return sum + totalClawbacks;
      }, 0);

    const outstandingCommission = Math.max(expectedCommission - receivedCommission, 0);

    return {
      premiumFacilitated: Number(premiumFacilitated.toFixed(2)),
      expectedCommission: Number(expectedCommission.toFixed(2)),
      receivedCommission: Number(receivedCommission.toFixed(2)),
      outstandingCommission: Number(outstandingCommission.toFixed(2)),
      disputedCommission: Number(disputedCommission.toFixed(2)),
      clawbacks: Number(clawbacks.toFixed(2)),
    };
  }

  async exportReconciliationCsv() {
    const rows = await this.prisma.commission.findMany();
    const header = [
      'policyId',
      'insurerId',
      'partnerId',
      'grossPremium',
      'commissionRate',
      'commissionAmount',
      'status',
      'updatedAt',
    ];

    const csv = [
      header.join(','),
      ...rows.map((row) => {
        const payload = (row.reconciliationData as Record<string, any>) || {};
        return [
          row.policyId,
          row.insurerId || '',
          row.partnerId || '',
          Number(row.grossPremium ?? payload.premiumFacilitated ?? 0),
          Number(row.commissionRate ?? payload.commissionRate ?? 0),
          Number(payload.expectedCommission ?? row.commissionAmount ?? 0),
          row.status,
          row.updatedAt.toISOString(),
        ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',');
      }),
    ].join('\n');

    return { csv, fileName: 'finance-reconciliation.csv' };
  }
}
