import { Test, TestingModule } from '@nestjs/testing';
import { WellnessService } from './wellness.service';
import { PrismaService } from '../prisma.service';

describe('WellnessService', () => {
  let service: WellnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WellnessService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WellnessService>(WellnessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
