import { InsurerAdapter, QuoteRequest, AdapterRawResponse } from './interfaces';

export class MockInsurerAdapter implements InsurerAdapter {
  constructor(
    private readonly name: string,
    private readonly basePremium: number,
    private readonly fixedCsr: string,
    private readonly failureRate: number = 0
  ) {}

  async getQuotes(request: QuoteRequest): Promise<AdapterRawResponse[]> {
    // 1. Simulate network delay (400ms - 1200ms)
    const delay = Math.floor(Math.random() * 800) + 400;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 2. Simulate occasional external failure
    if (Math.random() < this.failureRate) {
      throw new Error(`[Adapter Error] ${this.name} API timed out or responded with 500`);
    }

    const baseCoverageSummary =
      request.vertical === 'life'
        ? 'Term Life 50 Lakhs'
        : request.vertical === 'health'
        ? 'Comprehensive Health 5 Lakhs'
        : 'Full Third-Party & Own Damage';

    return [
      {
        insurerName: this.name,
        planName: `${this.name} Standard ${request.vertical.charAt(0).toUpperCase() + request.vertical.slice(1)}`,
        basePremiumValue: this.basePremium,
        baseCoverageSummary,
        claimSettlementRatio: this.fixedCsr,
        metadata: {
          cashlessNetworkSize: 42,
        },
      },
      {
        insurerName: this.name,
        planName: `${this.name} Premium ${request.vertical.charAt(0).toUpperCase() + request.vertical.slice(1)}`,
        basePremiumValue: this.basePremium + 3000,
        baseCoverageSummary: `${baseCoverageSummary} + Zero Dep`,
        claimSettlementRatio: this.fixedCsr,
        metadata: {
          cashlessNetworkSize: 85,
          deductibleAmount: 0,
        },
      },
    ];
  }
}
