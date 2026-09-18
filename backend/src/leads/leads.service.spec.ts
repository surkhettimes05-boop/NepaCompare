import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            customer: {
              findFirst: jest.fn(),
            },
            policy: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback({
              lead: {
                findUnique: jest.fn(),
                update: jest.fn(),
              },
              leadStatusHistory: {
                create: jest.fn(),
              },
              policy: {
                findFirst: jest.fn(),
                create: jest.fn(),
              },
              customer: {
                findFirst: jest.fn(),
              },
              user: {
                findUnique: jest.fn(),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should reject a duplicate lead for the same mobile number and vertical', async () => {
    (prisma.lead.findFirst as jest.Mock).mockResolvedValue({ id: 'lead-1', vertical: 'MOTOR', formData: { phone: '9800000000' } });

    const result = await service.create({
      vertical: 'MOTOR',
      source: 'website',
      formData: { phone: '9800000000', fullName: 'Ramesh' },
    });

    expect(result.duplicate).toBe(true);
    expect(prisma.lead.create).not.toHaveBeenCalled();
  });

  it('should block duplicate policy creation for the same customer and vertical', async () => {
    (prisma.lead.findUnique as jest.Mock).mockResolvedValue({
      id: 'lead-2',
      userId: 'user-2',
      customerId: 'customer-2',
      vertical: 'MOTOR',
      status: 'NEW',
      formData: { phone: '9800000001' },
    });

    (prisma.customer as any).findFirst = jest.fn().mockResolvedValue({ id: 'customer-2' });
    (prisma.policy.findFirst as jest.Mock).mockResolvedValue({ id: 'policy-1' });

    await expect(service.buyLead('lead-2', 'user-2')).rejects.toThrow('already exists');
  });
});
