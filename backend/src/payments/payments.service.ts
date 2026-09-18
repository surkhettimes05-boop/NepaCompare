import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma.service';
import { PaymentProvider } from './payment-provider.interface';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PAYMENT_PROVIDER') private readonly paymentProvider: PaymentProvider,
  ) {}

  private verifyWebhookSignature(signature: string | undefined, payload: Record<string, any>, _provider: string): boolean {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
    if (!secret) {
      throw new BadRequestException('PAYMENT_WEBHOOK_SECRET is not configured');
    }

    if (!signature) {
      return false;
    }

    const normalized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expected = crypto.createHmac('sha256', secret).update(normalized).digest('hex');
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  }

  async createPayment(input: {
    applicationId: string;
    amount: number;
    currency?: string;
    customerId?: string;
    idempotencyKey?: string;
    metadata?: Record<string, any>;
    provider?: string;
  }) {
    const key = input.idempotencyKey || `${input.applicationId}:${input.amount}:${Date.now()}`;

    const existing = await this.prisma.payment.findFirst({
      where: { idempotencyKey: key },
    });

    if (existing) {
      return {
        id: existing.id,
        paymentReference: existing.paymentReference,
        idempotencyKey: existing.idempotencyKey,
        status: existing.status,
        duplicate: true,
      };
    }

    const providerResult = await this.paymentProvider.createPayment({
      applicationId: input.applicationId,
      amount: input.amount,
      currency: input.currency || 'NPR',
      metadata: { ...(input.metadata || {}), customerId: input.customerId },
      idempotencyKey: key,
    });

    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const payment = await this.prisma.payment.create({
      data: {
        applicationId: input.applicationId,
        amount: input.amount,
        currency: input.currency || 'NPR',
        provider: input.provider || 'generic',
        paymentReference,
        externalReference: providerResult.externalReference || null,
        status: 'CREATED',
        idempotencyKey: key,
        verificationToken: providerResult.verificationToken || null,
        expiresAt: providerResult.expiresAt || null,
        metadata: {
          providerData: providerResult.raw || {},
          applicationId: input.applicationId,
          customerId: input.customerId,
          idempotencyKey: key,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: input.customerId || null,
        action: 'PAYMENT_CREATED',
        entityType: 'Payment',
        entityId: payment.id,
        before: null,
        after: {
          paymentReference,
          idempotencyKey: key,
          status: 'CREATED',
          externalReference: providerResult.externalReference,
        },
      },
    });

    return {
      id: payment.id,
      paymentReference,
      idempotencyKey: key,
      status: payment.status,
      duplicate: false,
      provider: payment.provider,
      providerStatus: providerResult.providerStatus || 'CREATED',
      verificationToken: payment.verificationToken,
      expiresAt: payment.expiresAt,
    };
  }

  async verifyPayment(paymentReference: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentReference },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const verification = await this.paymentProvider.verifyPayment({
      paymentReference,
      externalReference: payment.externalReference || undefined,
      provider: payment.provider,
    });

    if (!verification.verified) {
      throw new BadRequestException(verification.reason || 'Payment could not be verified');
    }

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: verification.status.toUpperCase() as any,
        verifiedAt: new Date(),
        metadata: {
          ...(payment.metadata as Record<string, any> || {}),
          verificationResult: verification.raw || verification,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PAYMENT_VERIFIED',
        entityType: 'Payment',
        entityId: payment.id,
        before: { status: payment.status },
        after: { status: updated.status, verifiedAt: updated.verifiedAt },
      },
    });

    return updated;
  }

  async getPaymentStatus(paymentReference: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentReference },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const providerStatus = await this.paymentProvider.getStatus({
      paymentReference,
      externalReference: payment.externalReference || undefined,
    });

    return {
      paymentReference,
      status: providerStatus.status,
      internalStatus: payment.status,
      raw: providerStatus.raw,
    };
  }

  async refundPayment(paymentReference: string, amount?: number, reason?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentReference },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const refund = await this.paymentProvider.refundPayment({
      paymentReference,
      amount,
      reason,
    });

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: refund.status as any,
        metadata: {
          ...(payment.metadata as Record<string, any> || {}),
          refund: refund.raw || refund,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PAYMENT_REFUNDED',
        entityType: 'Payment',
        entityId: payment.id,
        before: { status: payment.status },
        after: { status: updated.status, refund: refund.raw || refund },
      },
    });

    return updated;
  }

  async handleWebhook(input: {
    provider: string;
    eventId: string;
    eventType: string;
    payload: Record<string, any>;
    signature?: string;
    paymentReference?: string;
  }) {
    if (!this.verifyWebhookSignature(input.signature, input.payload, input.provider)) {
      throw new BadRequestException('Invalid payment webhook signature');
    }

    const existing = await this.prisma.paymentWebhookEvent.findFirst({
      where: {
        provider: input.provider,
        eventId: input.eventId,
      },
    });

    if (existing) {
      return { duplicate: true, eventId: input.eventId, processed: false };
    }

    const payment = input.paymentReference
      ? await this.prisma.payment.findUnique({ where: { paymentReference: input.paymentReference } })
      : await this.prisma.payment.findFirst({
          where: {
            externalReference: input.payload?.externalReference || input.payload?.reference || undefined,
          },
        });

    if (!payment) {
      throw new NotFoundException('Payment not found for webhook payload');
    }

    const event = await this.prisma.paymentWebhookEvent.create({
      data: {
        paymentId: payment.id,
        provider: input.provider,
        eventId: input.eventId,
        eventType: input.eventType,
        signatureHash: input.signature || null,
        payload: input.payload,
      },
    });

    const verification = await this.paymentProvider.verifyPayment({
      paymentReference: payment.paymentReference,
      externalReference: payment.externalReference || undefined,
      provider: input.provider,
    });

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: verification.status.toUpperCase() as any,
        verifiedAt: verification.verified ? new Date() : payment.verifiedAt,
        metadata: {
          ...(payment.metadata as Record<string, any> || {}),
          webhookEvent: input.eventType,
          lastWebhookPayload: input.payload,
        },
      },
    });

    await this.prisma.paymentWebhookEvent.update({
      where: { id: event.id },
      data: { processedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PAYMENT_WEBHOOK_PROCESSED',
        entityType: 'Payment',
        entityId: payment.id,
        before: { status: payment.status },
        after: { status: updated.status, eventId: input.eventId },
      },
    });

    return {
      duplicate: false,
      paymentReference: payment.paymentReference,
      status: updated.status,
      eventId: input.eventId,
    };
  }
}
