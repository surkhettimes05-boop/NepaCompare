export type PaymentProviderStatus = 'CREATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export interface PaymentProviderResult {
  externalReference?: string;
  providerStatus?: PaymentProviderStatus;
  verificationToken?: string;
  expiresAt?: Date;
  raw?: Record<string, any>;
  [key: string]: any;
}

export interface PaymentVerificationResult {
  status: PaymentProviderStatus;
  verified: boolean;
  reason?: string;
  raw?: Record<string, any>;
  [key: string]: any;
}

export interface PaymentProvider {
  createPayment(input: {
    applicationId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
  }): Promise<PaymentProviderResult>;

  verifyPayment(input: {
    paymentReference: string;
    externalReference?: string;
    provider?: string;
  }): Promise<PaymentVerificationResult>;

  refundPayment(input: {
    paymentReference: string;
    amount?: number;
    reason?: string;
  }): Promise<{ status: PaymentProviderStatus; raw?: Record<string, any> }>; 

  getStatus(input: {
    paymentReference: string;
    externalReference?: string;
  }): Promise<{ status: PaymentProviderStatus; raw?: Record<string, any> }>;
}
