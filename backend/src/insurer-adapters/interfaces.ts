export type QuoteSourceType = 'REAL_TIME' | 'INDICATIVE' | 'MANUAL';
export type QuoteCapability =
  | 'getProducts'
  | 'validateQuoteRequest'
  | 'getQuote'
  | 'createApplication'
  | 'uploadDocument'
  | 'initiatePayment'
  | 'issuePolicy'
  | 'getPolicy'
  | 'renewPolicy'
  | 'getClaimStatus';

export interface QuoteRequest {
  vertical: 'motor' | 'health' | 'life' | 'travel' | string;
  applicant: {
    age?: number;
    gender?: 'M' | 'F' | 'O';
    location?: string;
  };
  coverageParameters: {
    // For motor (e.g., CC, vehicle type)
    cc?: number;
    vehicleType?: string;
    year?: number;
    ncb?: number;
    usage?: string;
    make?: string;
    model?: string;
    // For health/life (e.g., sum assured, dependents)
    sumAssured?: number;
    dependents?: number;
    preExistingConditions?: boolean;
    smoker?: boolean;
    income?: string;
    // For travel
    destination?: string;
    tripDurationDays?: number;
  };
}

export interface AdapterRawResponse {
  insurerName: string;
  planName: string;
  basePremiumValue: number;
  baseCoverageSummary: string;
  claimSettlementRatio?: string;
  metadata: {
    cashlessNetworkSize?: number;
    waitingPeriodDays?: number;
    deductibleAmount?: number;
  };
}

export interface QuoteResponse {
  insurerName: string;
  planName: string;
  premiumValue: number;
  premiumFormatted: string; // e.g., "NPR 11,500/yr"
  coverageSummary: string; // e.g., "Full Third-Party & Own Damage"
  claimSettlementRatio?: string; // e.g., "93.4%"
  exclusions: string[];
  metadata: {
    // Insurer-specific normalized terms
    cashlessNetworkSize?: number;
    waitingPeriodDays?: number;
    deductibleAmount?: number;
  };
}

export interface ProviderCapability {
  capability: QuoteCapability | string;
  supported: boolean;
  reason?: string;
}

export interface InsurerAdapter {
  readonly name: string;
  readonly quoteSource: QuoteSourceType;
  /**
   * Fetch quotes from an external insurer based on a normalized request.
   */
  getQuotes(request: QuoteRequest): Promise<AdapterRawResponse[]>;
  getCapabilities(): ProviderCapability[];
}

export interface NormalizedQuoteResult {
  id: string;
  provider: string;
  providerCapabilities: ProviderCapability[];
  quoteSource: QuoteSourceType;
  insurer: string;
  plan: string;
  premium: string;
  premiumValue: number;
  coverage: string;
  csr: string;
  exclusions: string[];
  isBestMatch: boolean;
}
