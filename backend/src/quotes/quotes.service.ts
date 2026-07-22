import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QuoteRequest } from '../insurer-adapters/interfaces';
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

  /**
   * Deterministically generates a mock base premium based on the partner's ID.
   */
  private generateDeterministicMockPremium(partnerId: string): number {
    const hash = crypto.createHash('md5').update(partnerId).digest('hex');
    const num = parseInt(hash.substring(0, 4), 16);
    // Base premium between 5000 and 15000
    return 5000 + (num % 10000);
  }

  /**
   * Deterministically generates a mock CSR based on the partner's ID.
   */
  private generateDeterministicMockCsr(partnerId: string): string {
    const hash = crypto.createHash('md5').update(partnerId).digest('hex');
    const num = parseInt(hash.substring(4, 8), 16);
    const base = 85 + (num % 14);
    const decimal = num % 10;
    return `${base}.${decimal}%`;
  }

  async getQuotes(vertical: string, criteria: any) {
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

    // 2. Resolve Active Insurers from DB that cover this vertical
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

    // 3. Dynamically instantiate adapters based on DB config
    const adapters = activeInsurers.map(partner => {
      const basePremium = this.generateDeterministicMockPremium(partner.id);
      const csr = this.generateDeterministicMockCsr(partner.id);
      
      if (partner.integrationType === 'MOCK_LEGACY_REST') {
        // Use 0 failure rate so it doesn't break UI testing, but latency is 2-5s.
        return new SimulatedRestInsurerAdapter(partner.name, basePremium, csr, 0); 
      } else {
        return new MockInsurerAdapter(partner.name, basePremium, csr, 0); 
      }
    });

    // 4. Fan-out to all adapters concurrently to get raw quotes
    const results = await Promise.allSettled(
      adapters.map((adapter) => adapter.getQuotes(request))
    );

    // 5. Aggregate successful raw responses
    const allRawQuotes = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allRawQuotes.push(...result.value);
      } else {
        console.error('Adapter failed:', result.reason);
      }
    }

    // 6. Process raw quotes through the Rating Engine
    const finalQuotes = allRawQuotes.map(rawQuote => this.ratingEngine.process(rawQuote, request));

    // 7. Map back to legacy frontend format so we don't break the UI
    const mappedQuotes = finalQuotes.map((q) => {
      return {
        id: Buffer.from(`${q.insurerName}-${q.planName}`).toString('base64'),
        insurer: q.insurerName,
        plan: q.planName,
        premium: q.premiumFormatted,
        premiumValue: q.premiumValue,
        coverage: q.coverageSummary,
        csr: q.claimSettlementRatio,
        exclusions: q.exclusions,
      };
    });

    // 8. Sort by premium and flag the cheapest as "Best Match"
    mappedQuotes.sort((a, b) => a.premiumValue - b.premiumValue);
    
    return mappedQuotes.map((q, index) => ({
      ...q,
      isBestMatch: index === 0
    }));
  }
}
