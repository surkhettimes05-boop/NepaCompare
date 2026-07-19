import { InsurerAdapter, QuoteRequest, AdapterRawResponse } from './interfaces';

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
  constructor(
    private readonly name: string,
    private readonly basePremium: number,
    private readonly fixedCsr: string,
    private readonly failureRate: number = 0.2 // Higher default failure rate
  ) {}

  /**
   * Internal method simulating the HTTP call to the external legacy REST API.
   * Returns data in their format, not ours.
   */
  private async fetchFromLegacyApi(request: QuoteRequest): Promise<LegacyRestPayload[]> {
    // 1. Simulate high network latency (2000ms - 5000ms)
    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 2. Simulate high failure rate
    if (Math.random() < this.failureRate) {
      throw new Error(`[SimulatedRestAdapter Error] ${this.name} legacy API connection reset by peer (503)`);
    }

    // 3. Return their messy shape
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

  /**
   * Transforms the legacy JSON into our strict AdapterRawResponse contract.
   * This is publicly accessible for unit testing purposes.
   */
  public transformPayload(payload: LegacyRestPayload): AdapterRawResponse {
    return {
      insurerName: this.name, // Use adapter's registered name instead of messy Vendor_ID
      planName: `${this.name} ${payload.Prod_Name === 'STD_TIER' ? 'Standard' : 'Premium'}`,
      basePremiumValue: parseInt(payload.Base_Amt, 10), // Type coercion
      baseCoverageSummary: payload.Cov_String,
      claimSettlementRatio: payload.Stats.Settlement_Pct,
      metadata: {
        cashlessNetworkSize: payload.Stats.Hospitals,
      },
    };
  }

  async getQuotes(request: QuoteRequest): Promise<AdapterRawResponse[]> {
    // 1. Fetch raw messy data
    const rawPayloads = await this.fetchFromLegacyApi(request);

    // 2. Map their schema to our contract
    return rawPayloads.map((payload) => this.transformPayload(payload));
  }
}
