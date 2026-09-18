import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type KycVerificationMethod = 'MANUAL' | 'PROVIDER';
export type KycStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async createKyc(customerId: string, verificationMethod: KycVerificationMethod, metadata?: Record<string, any>) {
    const kyc = await this.prisma.kyc.create({
      data: {
        customerId,
        verificationMethod,
        verificationStatus: 'PENDING',
        metadata: metadata || {},
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'KYC_CREATED',
        entityType: 'Kyc',
        entityId: kyc.id,
        after: { customerId, verificationMethod, verificationStatus: 'PENDING' },
      },
    });

    return kyc;
  }

  async updateKycStatus(kycId: string, status: KycStatus, actorId?: string, details?: string) {
    const kyc = await this.prisma.kyc.findUnique({ where: { id: kycId } });
    if (!kyc) {
      throw new NotFoundException('KYC record not found');
    }

    const updated = await this.prisma.kyc.update({
      where: { id: kycId },
      data: {
        verificationStatus: status as any,
        metadata: {
          ...(kyc.metadata as Record<string, any> || {}),
          lastUpdatedBy: actorId,
          lastUpdateNote: details || '',
          lastUpdatedAt: new Date().toISOString(),
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'KYC_STATUS_UPDATED',
        entityType: 'Kyc',
        entityId: kycId,
        before: { verificationStatus: kyc.verificationStatus },
        after: { verificationStatus: status, details },
      },
    });

    return updated;
  }
}
