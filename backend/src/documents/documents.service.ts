import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ObjectStorageService } from './object-storage.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly objectStorage: ObjectStorageService,
  ) {}

  async uploadDocument(input: {
    applicationId?: string;
    customerId?: string;
    documentType: string;
    fileName: string;
    mimeType: string;
    size: number;
    checksum: string;
    uploaderId: string;
    uploadedByRole?: string;
    bucket?: string;
  }) {
    const key = `documents/${input.customerId || 'customer'}/${Date.now()}-${input.fileName}`;
    const storageResult = await this.objectStorage.putObject(
      input.bucket || 'khaacho-documents',
      key,
      Buffer.alloc(0),
      input.mimeType,
    );

    const document = await this.prisma.document.create({
      data: {
        customerId: input.customerId,
        applicationId: input.applicationId,
        documentType: input.documentType as any,
        storageReference: storageResult.key,
        metadata: {
          objectStorageKey: storageResult.key,
          originalFileName: input.fileName,
          mimeType: input.mimeType,
          size: input.size,
          checksum: input.checksum,
          uploaderId: input.uploaderId,
          uploadedByRole: input.uploadedByRole,
        },
        verificationStatus: 'PENDING',
        uploadedById: input.uploaderId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: input.uploaderId,
        action: 'DOCUMENT_UPLOADED',
        entityType: 'Document',
        entityId: document.id,
        before: null,
        after: {
          storageReference: storageResult.key,
          documentType: input.documentType,
          verificationStatus: 'PENDING',
        },
      },
    });

    return {
      id: document.id,
      storageKey: document.storageReference,
      verificationStatus: document.verificationStatus,
      signedUrl: await this.objectStorage.getSignedUrl('khaacho-documents', storageResult.key),
    };
  }

  async verifyDocument(documentId: string, status: string, reason: string, actorId: string) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        verificationStatus: status as any,
        metadata: {
          ...(document.metadata as Record<string, any> || {}),
          verificationReason: reason,
          verifiedBy: actorId,
          verifiedAt: new Date().toISOString(),
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'DOCUMENT_VERIFICATION_UPDATED',
        entityType: 'Document',
        entityId: documentId,
        before: { verificationStatus: document.verificationStatus },
        after: { verificationStatus: status, reason },
      },
    });

    return updated;
  }

  async getDocumentSignedUrl(documentId: string, user: any) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const scopedToCustomer = document.customerId && user?.role === 'CUSTOMER' && user?.userId !== document.customerId;
    if (scopedToCustomer) {
      throw new ForbiddenException('You do not have access to this document');
    }

    const signedUrl = await this.objectStorage.getSignedUrl('khaacho-documents', document.storageReference);
    const metadata = (document.metadata as Record<string, any>) || {};
    return {
      documentId: document.id,
      signedUrl,
      verificationStatus: document.verificationStatus,
      mimeType: metadata.mimeType || 'application/octet-stream',
      storageKey: document.storageReference,
    };
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
