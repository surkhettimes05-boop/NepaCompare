import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { PrismaService } from '../prisma.service';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        {
          provide: PrismaService,
          useValue: {
            claim: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            claimNote: {
              create: jest.fn(),
            },
            claimCommunication: {
              create: jest.fn(),
            },
            auditLog: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a claim with reported status and a claim reference', async () => {
    (prisma.claim.create as jest.Mock).mockResolvedValue({
      id: 'claim-1',
      claimReference: 'CLM-001',
      status: 'REPORTED',
    });

    const result = await service.reportClaim({
      policyId: 'policy-1',
      customerId: 'customer-1',
      description: 'Rear bumper damage',
      incidentDate: new Date('2026-09-10'),
    });

    expect(result.claimReference).toBe('CLM-001');
    expect(result.status).toBe('REPORTED');
    expect(prisma.claim.create).toHaveBeenCalled();
  });

  it('should record insurer communication and audit every status transition', async () => {
    (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
      id: 'claim-1',
      status: 'SUBMITTED_TO_INSURER',
      customerId: 'customer-1',
    });

    (prisma.claim.update as jest.Mock).mockResolvedValue({
      id: 'claim-1',
      status: 'UNDER_REVIEW',
    });

    await service.updateStatus('claim-1', 'UNDER_REVIEW', 'ops-1', 'Insurer requested more info');
    await service.recordCommunication('claim-1', {
      channel: 'EMAIL',
      direction: 'OUTBOUND',
      note: 'Sent insurer additional evidence',
      insurerReference: 'INS-42',
    });

    expect(prisma.claim.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'claim-1' },
        data: expect.objectContaining({ status: 'UNDER_REVIEW' }),
      }),
    );
    expect(prisma.claimCommunication.create).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
