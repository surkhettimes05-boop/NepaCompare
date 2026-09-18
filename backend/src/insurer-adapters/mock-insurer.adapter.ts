import { InsurerAdapter, QuoteRequest, AdapterRawResponse, ProviderCapability, QuoteSourceType } from './interfaces';

export class MockInsurerAdapter implements InsurerAdapter {
  readonly name: string;
  readonly quoteSource: QuoteSourceType = 'REAL_TIME';

  constructor(
    name: string,
    private readonly basePremium: number,
    private readonly fixedCsr: string,
    private readonly failureRate: number = 0
  ) {
    this.name = name;
  }

  getCapabilities(): ProviderCapability[] {
    return [
      { capability: 'getProducts', supported: true },
      { capability: 'validateQuoteRequest', supported: true },
      { capability: 'getQuote', supported: true },
      { capability: 'createApplication', supported: false, reason: 'Not available in mock provider' },
      { capability: 'uploadDocument', supported: false, reason: 'Not available in mock provider' },
      { capability: 'initiatePayment', supported: false, reason: 'Not available in mock provider' },
      { capability: 'issuePolicy', supported: false, reason: 'Not available in mock provider' },
      { capability: 'getPolicy', supported: false, reason: 'Not available in mock provider' },
      { capability: 'renewPolicy', supported: false, reason: 'Not available in mock provider' },
      { capability: 'getClaimStatus', supported: false, reason: 'Not available in mock provider' },
    ];
  }

  async getQuotes(request: QuoteRequest): Promise<AdapterRawResponse[]> {
    const delay = Math.floor(Math.random() * 800) + 400;
    await new Promise((resolve) => setTimeout(resolve, delay));

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
