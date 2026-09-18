import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string, user: any) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
        customer: true,
        policies: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (user?.role === 'CUSTOMER' && application.customerId !== user.userId) {
      throw new ForbiddenException('Customer cannot access another customer record');
    }

    return application;
  }

  async submitForReview(applicationId: string, actorId?: string) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: 'UNDER_REVIEW' },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actorId || application.customerId,
        action: 'APPLICATION_SUBMITTED_FOR_REVIEW',
        entityType: 'Application',
        entityId: applicationId,
        before: { status: application.status },
        after: { status: 'UNDER_REVIEW' },
      },
    });

    return updated;
  }

  async replaceDocument(applicationId: string, oldDocumentId: string, newDocumentId: string, actorId: string) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const [oldDocument, newDocument] = await Promise.all([
      this.prisma.document.findUnique({ where: { id: oldDocumentId } }),
      this.prisma.document.findUnique({ where: { id: newDocumentId } }),
    ]);

    if (!oldDocument || !newDocument) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.document.update({
      where: { id: oldDocumentId },
      data: { deletedAt: new Date() },
    });

    await this.prisma.document.update({
      where: { id: newDocumentId },
      data: {
        applicationId,
        verificationStatus: 'PENDING',
        metadata: {
          ...(newDocument.metadata as Record<string, any> || {}),
          replacedDocumentId: oldDocumentId,
          replacedAt: new Date().toISOString(),
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'DOCUMENT_REPLACED',
        entityType: 'Application',
        entityId: applicationId,
        before: { documentId: oldDocumentId },
        after: { documentId: newDocumentId, replacement: true },
      },
    });

    return { applicationId, replacedDocumentId: oldDocumentId, replacementDocumentId: newDocumentId };
  }

  async rejectDocument(documentId: string, reason: string, actorId: string) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        verificationStatus: 'REJECTED',
        metadata: {
          ...(document.metadata as Record<string, any> || {}),
          rejectionReason: reason,
          rejectedBy: actorId,
          rejectedAt: new Date().toISOString(),
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'DOCUMENT_REJECTED',
        entityType: 'Document',
        entityId: documentId,
        before: { verificationStatus: document.verificationStatus },
        after: { verificationStatus: 'REJECTED', reason },
      },
    });

    return updated;
  }
}
