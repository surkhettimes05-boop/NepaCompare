import { InsurerAdapter, QuoteRequest, AdapterRawResponse, ProviderCapability, QuoteSourceType } from './interfaces';

// Represents a messy, poorly-named JSON response from a legacy REST API
export interface LegacyRestPayload {
  Vendor_ID: string;
  Prod_Name: string;
  Base_Amt: string; // Stored as string in the legacy system
  Cov_String: string;
  Stats: {
    Settlement_Pct: string;
    Hospitals: number;
  };
}

export class SimulatedRestInsurerAdapter implements InsurerAdapter {
  readonly name: string;
  readonly quoteSource: QuoteSourceType = 'REAL_TIME';

  constructor(
    name: string,
    private readonly basePremium: number,
    private readonly fixedCsr: string,
    private readonly failureRate: number = 0.2 // Higher default failure rate
  ) {
    this.name = name;
  }

  getCapabilities(): ProviderCapability[] {
    return [
      { capability: 'getProducts', supported: true },
      { capability: 'validateQuoteRequest', supported: true },
      { capability: 'getQuote', supported: true },
      { capability: 'createApplication', supported: false, reason: 'Legacy adapter does not support application creation' },
      { capability: 'uploadDocument', supported: false, reason: 'Legacy adapter does not support uploadDocument' },
      { capability: 'initiatePayment', supported: false, reason: 'Legacy adapter does not support payment initiation' },
      { capability: 'issuePolicy', supported: false, reason: 'Legacy adapter does not support policy issuance' },
      { capability: 'getPolicy', supported: false, reason: 'Legacy adapter does not support policy retrieval' },
      { capability: 'renewPolicy', supported: false, reason: 'Legacy adapter does not support renewals' },
      { capability: 'getClaimStatus', supported: false, reason: 'Legacy adapter does not support claim tracking' },
    ];
  }

  private async fetchFromLegacyApi(request: QuoteRequest): Promise<LegacyRestPayload[]> {
    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (Math.random() < this.failureRate) {
      throw new Error(`[SimulatedRestAdapter Error] ${this.name} legacy API connection reset by peer (503)`);
    }

    const covString =
      request.vertical === 'life'
        ? 'Life-50L'
        : request.vertical === 'health'
        ? 'Health-5L'
        : 'TP+OD-Full';

    return [
      {
        Vendor_ID: this.name.toUpperCase().replace(/\s+/g, '_'),
        Prod_Name: 'STD_TIER',
        Base_Amt: this.basePremium.toString(),
        Cov_String: covString,
        Stats: {
          Settlement_Pct: this.fixedCsr,
          Hospitals: 42,
        },
      },
      {
        Vendor_ID: this.name.toUpperCase().replace(/\s+/g, '_'),
        Prod_Name: 'PREM_TIER',
        Base_Amt: (this.basePremium + 3000).toString(),
        Cov_String: `${covString}-PLUS`,
        Stats: {
          Settlement_Pct: this.fixedCsr,
          Hospitals: 85,
        },
      },
    ];
  }

  public transformPayload(payload: LegacyRestPayload): AdapterRawResponse {
    return {
      insurerName: this.name,
      planName: `${this.name} ${payload.Prod_Name === 'STD_TIER' ? 'Standard' : 'Premium'}`,
      basePremiumValue: parseInt(payload.Base_Amt, 10),
      baseCoverageSummary: payload.Cov_String,
      claimSettlementRatio: payload.Stats.Settlement_Pct,
      metadata: {
        cashlessNetworkSize: payload.Stats.Hospitals,
      },
    };
  }

  async getQuotes(request: QuoteRequest): Promise<AdapterRawResponse[]> {
    const rawPayloads = await this.fetchFromLegacyApi(request);
    return rawPayloads.map((payload) => this.transformPayload(payload));
  }
}
