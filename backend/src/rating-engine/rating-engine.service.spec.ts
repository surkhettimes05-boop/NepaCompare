import { Test, TestingModule } from '@nestjs/testing';
import { RatingEngineService } from './rating-engine.service';
import { AdapterRawResponse, QuoteRequest } from '../insurer-adapters/interfaces';

describe('RatingEngineService', () => {
  let service: RatingEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingEngineService],
    }).compile();

    service = module.get<RatingEngineService>(RatingEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('process()', () => {
    const rawQuote: AdapterRawResponse = {
      insurerName: 'Test Insurer',
      planName: 'Test Plan',
      basePremiumValue: 10000,
      baseCoverageSummary: 'Base Coverage',
      claimSettlementRatio: '95.0%',
      metadata: { cashlessNetworkSize: 50 },
    };

    it('should apply young-driver-penalty when applicant is under 25', () => {
      const request: QuoteRequest = {
        vertical: 'motor',
        applicant: { age: 22 },
        coverageParameters: { cc: 1000 },
      };

      const result = service.process(rawQuote, request);
      // Base (10000) + young-driver penalty (2500) = 12500
      expect(result.premiumValue).toBe(12500);
      expect(result.premiumFormatted).toBe('NPR 12,500/yr');
    });

    it('should NOT apply young-driver-penalty when applicant is 25 or older', () => {
      const request: QuoteRequest = {
        vertical: 'motor',
        applicant: { age: 35 },
        coverageParameters: { cc: 1000 },
      };

      const result = service.process(rawQuote, request);
      // Base (10000) with no penalties
      expect(result.premiumValue).toBe(10000);
      expect(result.premiumFormatted).toBe('NPR 10,000/yr');
    });

    it('should NOT apply young-driver-penalty for health quotes (scope test)', () => {
      const request: QuoteRequest = {
        vertical: 'health',
        applicant: { age: 22 }, // Under 25, but it's health!
        coverageParameters: {},
      };

      const result = service.process(rawQuote, request);
      expect(result.premiumValue).toBe(10000);
    });

    it('should apply pre-existing conditions penalty (20%) for health', () => {
      const request: QuoteRequest = {
        vertical: 'health',
        applicant: { age: 30 },
        coverageParameters: { preExistingConditions: true },
      };

      const result = service.process(rawQuote, request);
      // Base (10000) * 1.2 = 12000
      expect(result.premiumValue).toBe(12000);
    });

    it('should apply dependents bump additively (+15% per dependent) for health', () => {
      const request: QuoteRequest = {
        vertical: 'health',
        applicant: { age: 30 },
        coverageParameters: { dependents: 3 }, // 3 dependents = 45% bump
      };

      const result = service.process(rawQuote, request);
      // Base (10000) * (1 + 0.15 * 3) = 14500
      expect(result.premiumValue).toBe(14500);
    });

    it('should apply both health penalties correctly', () => {
      const request: QuoteRequest = {
        vertical: 'health',
        applicant: { age: 30 },
        coverageParameters: { preExistingConditions: true, dependents: 2 }, 
        // preExisting = +20% -> 12000
        // dependents = +30% -> 12000 * 1.30 = 15600
      };

      const result = service.process(rawQuote, request);
      expect(result.premiumValue).toBe(15600);
    });
  });
});

