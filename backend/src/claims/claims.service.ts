import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export type ClaimLifecycleState =
  | 'REPORTED'
  | 'DOCUMENTS_PENDING'
  | 'SUBMITTED_TO_INSURER'
  | 'UNDER_REVIEW'
  | 'SURVEY_PENDING'
  | 'SURVEY_COMPLETED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SETTLED'
  | 'CLOSED'
  | 'DISPUTED';

@Injectable()
export class ClaimsService {
  constructor(private readonly prisma: PrismaService) {}

  async reportClaim(input: {
    policyId: string;
    customerId: string;
    description: string;
    incidentDate?: Date;
    metadata?: Record<string, any>;
  }) {
    const claimReference = `CLM-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const claim = await this.prisma.claim.create({
      data: {
        policyId: input.policyId,
        customerId: input.customerId,
        claimReference,
        incidentDate: input.incidentDate || new Date(),
        status: 'REPORTED',
        description: input.description,
        metadata: input.metadata || {},
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'CLAIM_REPORTED',
        entityType: 'Claim',
        entityId: claim.id,
        before: null,
        after: {
          claimReference,
          status: 'REPORTED',
          policyId: input.policyId,
          customerId: input.customerId,
        },
      },
    });

    return claim;
  }

  async updateStatus(claimId: string, status: ClaimLifecycleState, actorId?: string, note?: string) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const updated = await this.prisma.claim.update({
      where: { id: claimId },
      data: {
        status: status as any,
        metadata: {
          ...(claim.metadata as Record<string, any> || {}),
          lastStatusNote: note || '',
          lastUpdatedBy: actorId || null,
          lastUpdatedAt: new Date().toISOString(),
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        action: 'CLAIM_STATUS_UPDATED',
        entityType: 'Claim',
        entityId: claimId,
        before: { status: claim.status },
        after: { status, note },
      },
    });

    return updated;
  }

  async addNote(claimId: string, body: { authorId: string; message: string }) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const note = await this.prisma.claimNote.create({
      data: {
        claimId,
        authorId: body.authorId,
        message: body.message,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: body.authorId,
        action: 'CLAIM_NOTE_ADDED',
        entityType: 'Claim',
        entityId: claimId,
        before: null,
        after: { noteId: note.id, message: body.message },
      },
    });

    return note;
  }

  async recordCommunication(claimId: string, input: {
    channel: string;
    direction: string;
    note?: string;
    insurerReference?: string;
  }) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const communication = await this.prisma.claimCommunication.create({
      data: {
        claimId,
        channel: input.channel,
        direction: input.direction,
        note: input.note || '',
        insurerReference: input.insurerReference || claim.insurerReference || null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'CLAIM_COMMUNICATION_RECORDED',
        entityType: 'Claim',
        entityId: claimId,
        before: null,
        after: {
          channel: input.channel,
          direction: input.direction,
          insurerReference: input.insurerReference || claim.insurerReference,
        },
      },
    });

    return communication;
  }

  async setInsurerReference(claimId: string, insurerReference: string, actorId?: string) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const updated = await this.prisma.claim.update({
      where: { id: claimId },
      data: {
        insurerReference,
        metadata: {
          ...(claim.metadata as Record<string, any> || {}),
          insurerReference,
          updatedBy: actorId || null,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        action: 'CLAIM_INSURER_REFERENCE_SET',
        entityType: 'Claim',
        entityId: claimId,
        before: { insurerReference: claim.insurerReference },
        after: { insurerReference },
      },
    });

    return updated;
  }

  async findByCustomer(customerId: string) {
    return this.prisma.claim.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
