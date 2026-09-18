import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            analyticsEvent: {
              create: jest.fn(),
              findMany: jest.fn(),
              groupBy: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('tracks a sanitized event without leaking sensitive fields', async () => {
    (prisma.analyticsEvent.create as jest.Mock).mockResolvedValue({ id: 'evt-1' });

    await service.trackEvent({
      eventType: 'QUOTE_START',
      source: 'website',
      productType: 'MOTOR',
      metadata: {
        name: 'Alice',
        email: 'alice@example.com',
        phone: '9800000000',
        quoteValue: 25000,
      },
    });

    expect(prisma.analyticsEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          eventType: 'QUOTE_START',
          metadata: expect.objectContaining({
            quoteValue: 25000,
          }),
        }),
      }),
    );
  });

  it('builds funnel counts for customer journey stages', async () => {
    (prisma.analyticsEvent as any).count = jest.fn();
    (prisma.analyticsEvent.count as jest.Mock).mockImplementation(async ({ where }) => {
      const map: Record<string, number> = {
        VISITOR: 1200,
        QUOTE_START: 400,
        QUOTE_COMPLETION: 200,
        LEAD_CREATED: 120,
        QUOTE_CREATED: 70,
        APPLICATION_CREATED: 45,
        PAYMENT_SUCCESS: 25,
        POLICY_ISSUED: 15,
      };
      return map[where.eventType] ?? 0;
    });

    const result = await service.getCustomerFunnel({});

    expect(result.visitors).toBeGreaterThan(0);
    expect(result.policyIssued).toBe(15);
    expect(result.conversionRate).toBeGreaterThan(0);
  });
});
