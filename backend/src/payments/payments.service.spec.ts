import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { PaymentProvider } from './payment-provider.interface';
import { PrismaService } from '../prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env.PAYMENT_WEBHOOK_SECRET = 'test-secret';

    const provider: PaymentProvider = {
      createPayment: jest.fn().mockResolvedValue({
        externalReference: 'ext-123',
        providerStatus: 'CREATED',
        verificationToken: 'token-123',
        expiresAt: new Date(Date.now() + 60_000),
      }),
      verifyPayment: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
        verified: true,
      }),
      refundPayment: jest.fn().mockResolvedValue({
        status: 'REFUNDED',
      }),
      getStatus: jest.fn().mockResolvedValue({
        status: 'SUCCESS',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: {
            payment: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            paymentWebhookEvent: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            auditLog: {
              create: jest.fn(),
            },
          } },
        { provide: 'PAYMENT_PROVIDER', useValue: provider },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a payment record with an idempotency key and payment reference', async () => {
    (prisma.payment.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.payment.create as jest.Mock).mockResolvedValue({
      id: 'pay-1',
      paymentReference: 'PAY-REF-1',
      idempotencyKey: 'idem-1',
      status: 'CREATED',
    });

    const result = await service.createPayment({
      applicationId: 'app-1',
      amount: 2500,
      currency: 'NPR',
      customerId: 'customer-1',
      idempotencyKey: 'idem-1',
      metadata: { source: 'checkout' },
    });

    expect(result.paymentReference).toBeTruthy();
    expect(result.idempotencyKey).toBe('idem-1');
    expect(prisma.payment.create).toHaveBeenCalled();
  });

  it('should reject duplicate webhook events', async () => {
    (prisma.paymentWebhookEvent.findFirst as jest.Mock).mockResolvedValue({ id: 'evt-1' });

    const payload = { externalReference: 'ext-123' };
    const signature = crypto.createHmac('sha256', 'test-secret').update(JSON.stringify(payload)).digest('hex');

    const result = await service.handleWebhook({
      provider: 'manual',
      eventId: 'evt-1',
      eventType: 'payment.success',
      payload,
      signature,
    });

    expect(result.duplicate).toBe(true);
    expect(prisma.payment.update).not.toHaveBeenCalled();
  });
});
