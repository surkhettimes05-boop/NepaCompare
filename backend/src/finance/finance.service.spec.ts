import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService } from './finance.service';
import { PrismaService } from '../prisma.service';

describe('FinanceService', () => {
  let service: FinanceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        {
          provide: PrismaService,
          useValue: {
            commission: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            auditLog: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a commission record that separates premium facilitated from commission revenue', async () => {
    (prisma.commission.create as jest.Mock).mockResolvedValue({
      id: 'commission-1',
      status: 'CALCULATED',
      grossPremium: 25000,
      commissionAmount: 1250,
      commissionRate: 5,
      reconciliationData: {
        premiumFacilitated: 25000,
        expectedCommission: 1250,
        receivedCommission: 0,
      },
    });

    const result = await service.createCommissionRecord({
      policyId: 'policy-1',
      insurerId: 'insurer-1',
      partnerId: 'partner-1',
      premium: 25000,
      commissionRate: 5,
    });

    expect(result.status).toBe('CALCULATED');
    expect(result.commissionAmount).toBe(1250);
    expect(prisma.commission.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          grossPremium: 25000,
          commissionRate: 5,
          commissionAmount: 1250,
        }),
      }),
    );
  });

  it('should record financial adjustments and retain audit trail metadata', async () => {
    (prisma.commission.findUnique as jest.Mock).mockResolvedValue({
      id: 'commission-1',
      status: 'PAID',
      grossPremium: 25000,
      commissionAmount: 1250,
      reconciliationData: {
        premiumFacilitated: 25000,
        expectedCommission: 1250,
        receivedCommission: 800,
        adjustments: [],
      },
    });

    (prisma.commission.update as jest.Mock).mockResolvedValue({
      id: 'commission-1',
      status: 'RECONCILED',
      grossPremium: 25000,
      commissionAmount: 1250,
      reconciliationData: {
        premiumFacilitated: 25000,
        expectedCommission: 1250,
        receivedCommission: 1000,
        adjustments: [{ type: 'CLAWBACK', amount: 200 }],
      },
    });

    await service.recordAdjustment('commission-1', {
      type: 'CLAWBACK',
      amount: 200,
      notes: 'Reversal after audit',
      actorId: 'finance-1',
    });

    expect(prisma.commission.update).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
