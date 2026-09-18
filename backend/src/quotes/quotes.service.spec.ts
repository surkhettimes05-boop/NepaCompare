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
            process: jest.fn().mockReturnValue({
              insurerName: 'Partner A',
              planName: 'Partner A Standard Motor',
              premiumValue: 15000,
              premiumFormatted: 'NPR 15,000/yr',
              coverageSummary: 'Full Third-Party & Own Damage',
              claimSettlementRatio: '92.4%',
              exclusions: ['Racing/Speed tests'],
              metadata: {},
            }),
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
        { id: '1', displayName: 'Partner A', name: 'Partner A', integrationType: 'MOCK_STANDARD', type: 'INSURER', active: true, verticals: ['motor'] },
        { id: '2', displayName: 'Partner B', name: 'Partner B', integrationType: 'MOCK_LEGACY_REST', type: 'INSURER', active: true, verticals: ['motor'] },
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

  describe('Provider-neutral quote engine', () => {
    it('should report provider capabilities and normalized quote source metadata', async () => {
      const mockPartners = [
        { id: '1', name: 'Partner A', displayName: 'Partner A', integrationType: 'MOCK_STANDARD', type: 'INSURER', active: true, verticals: ['motor'] },
      ];

      (prisma.partner.findMany as jest.Mock).mockResolvedValue(mockPartners);
      jest.spyOn(MockInsurerAdapter.prototype, 'getQuotes').mockResolvedValue([
        {
          insurerName: 'Partner A',
          planName: 'Partner A Standard Motor',
          basePremiumValue: 12000,
          baseCoverageSummary: 'Full Third-Party & Own Damage',
          claimSettlementRatio: '92.4%',
          metadata: {},
        },
      ]);
      jest.spyOn(MockInsurerAdapter.prototype, 'getCapabilities').mockReturnValue([
        { capability: 'getQuote', supported: true },
        { capability: 'createApplication', supported: false, reason: 'Not available in mock provider' },
      ]);

      const result = await service.getQuotes('motor', { age: '29', cc: '1500' });

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toMatchObject({
        provider: 'Partner A',
        quoteSource: 'REAL_TIME',
      });
      expect(result[0].providerCapabilities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ capability: 'getQuote', supported: true }),
        ])
      );
    });

    it('should handle unsupported provider capabilities without failing the quote request', async () => {
      const mockPartners = [
        { id: '1', name: 'Partner A', displayName: 'Partner A', integrationType: 'MOCK_STANDARD', type: 'INSURER', active: true, verticals: ['motor'] },
      ];

      (prisma.partner.findMany as jest.Mock).mockResolvedValue(mockPartners);
      jest.spyOn(MockInsurerAdapter.prototype, 'getQuotes').mockResolvedValue([
        {
          insurerName: 'Partner A',
          planName: 'Partner A Standard Motor',
          basePremiumValue: 20000,
          baseCoverageSummary: 'Full Third-Party & Own Damage',
          claimSettlementRatio: '90%',
          metadata: {},
        },
      ]);
      jest.spyOn(MockInsurerAdapter.prototype, 'getCapabilities').mockReturnValue([
        { capability: 'issuePolicy', supported: false, reason: 'Provider is quote-only' },
      ]);

      await expect(service.getQuotes('motor', { age: '29' })).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            providerCapabilities: expect.arrayContaining([
              expect.objectContaining({ capability: 'issuePolicy', supported: false }),
            ]),
          }),
        ])
      );
    });
  });
});
