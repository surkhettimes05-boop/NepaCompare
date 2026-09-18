import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QuoteRequest, ProviderCapability, NormalizedQuoteResult, InsurerAdapter } from '../insurer-adapters/interfaces';
import { MockInsurerAdapter } from '../insurer-adapters/mock-insurer.adapter';
import { SimulatedRestInsurerAdapter } from '../insurer-adapters/simulated-rest-insurer.adapter';
import { RatingEngineService } from '../rating-engine/rating-engine.service';
import * as crypto from 'crypto';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private ratingEngine: RatingEngineService
  ) {}

  private generateDeterministicMockPremium(partnerId: string): number {
    const hash = crypto.createHash('md5').update(partnerId).digest('hex');
    const num = parseInt(hash.substring(0, 4), 16);
    return 5000 + (num % 10000);
  }

  private generateDeterministicMockCsr(partnerId: string): string {
    const hash = crypto.createHash('md5').update(partnerId).digest('hex');
    const num = parseInt(hash.substring(4, 8), 16);
    const base = 85 + (num % 14);
    const decimal = num % 10;
    return `${base}.${decimal}%`;
  }

  private resolveAdapter(partner: any): InsurerAdapter {
    const partnerName = partner.displayName || partner.legalName || partner.slug || 'Unknown Provider';
    const basePremium = this.generateDeterministicMockPremium(partner.id);
    const csr = this.generateDeterministicMockCsr(partner.id);

    if (partner.integrationType === 'MOCK_LEGACY_REST') {
      return new SimulatedRestInsurerAdapter(partnerName, basePremium, csr, 0);
    }

    return new MockInsurerAdapter(partnerName, basePremium, csr, 0);
  }

  async getQuotes(vertical: string, criteria: any): Promise<NormalizedQuoteResult[]> {
    const request: QuoteRequest = {
      vertical,
      applicant: {
        age: criteria.age ? parseInt(criteria.age, 10) : undefined,
      },
      coverageParameters: {
        cc: criteria.cc ? parseInt(criteria.cc, 10) : undefined,
        dependents: criteria.dependents ? parseInt(criteria.dependents, 10) : undefined,
        preExistingConditions: criteria.preExistingConditions === 'true',
        sumAssured: criteria.sumAssured ? parseInt(criteria.sumAssured, 10) : undefined,
        smoker: criteria.smoker === 'true',
        income: criteria.income,
        year: criteria.year ? parseInt(criteria.year, 10) : undefined,
        ncb: criteria.ncb ? parseInt(criteria.ncb, 10) : undefined,
        usage: criteria.usage,
        make: criteria.make,
        model: criteria.model,
        vehicleType: criteria.type,
      },
    };

    const allActiveInsurers = await this.prisma.partner.findMany({
      where: {
        type: 'INSURER',
        active: true,
      },
    });

    const activeInsurers = allActiveInsurers.filter((partner) => {
      const verticals = partner.verticals as string[];
      return verticals && verticals.includes(vertical);
    });

    if (activeInsurers.length === 0) {
      return [];
    }

    const adapters = activeInsurers.map((partner) => ({
      partner,
      adapter: this.resolveAdapter(partner),
    }));

    const settledResults = await Promise.allSettled(
      adapters.map(({ adapter }) => adapter.getQuotes(request))
    );

    const normalizedQuotes: NormalizedQuoteResult[] = [];
    settledResults.forEach((result, index) => {
      const { partner, adapter } = adapters[index];
      const providerCapabilities: ProviderCapability[] = adapter.getCapabilities();

      if (result.status === 'fulfilled') {
        const finalQuotes = result.value.map((rawQuote) => this.ratingEngine.process(rawQuote, request));

        const mappedQuotes = finalQuotes.map((quote) => ({
          id: Buffer.from(`${quote.insurerName}-${quote.planName}`).toString('base64'),
          provider: partner.displayName || partner.legalName || quote.insurerName,
          providerCapabilities,
          quoteSource: adapter.quoteSource,
          insurer: quote.insurerName,
          plan: quote.planName,
          premium: quote.premiumFormatted,
          premiumValue: quote.premiumValue,
          coverage: quote.coverageSummary,
          csr: quote.claimSettlementRatio || 'N/A',
          exclusions: quote.exclusions,
          isBestMatch: false,
        }));

        normalizedQuotes.push(...mappedQuotes);
      }
    });

    normalizedQuotes.sort((a, b) => a.premiumValue - b.premiumValue);
    return normalizedQuotes.map((quote, index) => ({
      ...quote,
      isBestMatch: index === 0,
    }));
  }
}
