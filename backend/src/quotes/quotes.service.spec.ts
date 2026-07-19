import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from './quotes.service';
import { PrismaService } from '../prisma.service';
import { RatingEngineService } from '../rating-engine/rating-engine.service';
import { MockInsurerAdapter } from '../insurer-adapters/mock-insurer.adapter';
import { SimulatedRestInsurerAdapter } from '../insurer-adapters/simulated-rest-insurer.adapter';

describe('QuotesService', () => {
  let service: QuotesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: PrismaService,
          useValue: {
            partner: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: RatingEngineService,
          useValue: {
            process: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Dynamic Adapter Instantiation', () => {
    it('should map MOCK_STANDARD to MockInsurerAdapter and MOCK_LEGACY_REST to SimulatedRestInsurerAdapter', async () => {
      const mockPartners = [
        { id: '1', name: 'Partner A', integrationType: 'MOCK_STANDARD', type: 'INSURER', active: true, verticals: ['motor'] },
        { id: '2', name: 'Partner B', integrationType: 'MOCK_LEGACY_REST', type: 'INSURER', active: true, verticals: ['motor'] },
      ];

      (prisma.partner.findMany as jest.Mock).mockResolvedValue(mockPartners);

      
      const mockAdapterSpy = jest.spyOn(MockInsurerAdapter.prototype, 'getQuotes').mockResolvedValue([]);
      const restAdapterSpy = jest.spyOn(SimulatedRestInsurerAdapter.prototype, 'getQuotes').mockResolvedValue([]);

      await service.getQuotes('motor', {});

      expect(mockAdapterSpy).toHaveBeenCalledTimes(1);
      expect(restAdapterSpy).toHaveBeenCalledTimes(1);

      mockAdapterSpy.mockRestore();
      restAdapterSpy.mockRestore();
    });
  });
});
