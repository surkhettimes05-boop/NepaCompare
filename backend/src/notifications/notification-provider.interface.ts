export type NotificationStatus =
  | 'QUEUED'
  | 'SENT'
  | 'RETRYING'
  | 'FAILED'
  | 'DELIVERED'
  | 'CLICKED';

export type NotificationDeliveryStatus =
  | 'QUEUED'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'REJECTED'
  | 'UNDELIVERABLE';

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP';

export type NotificationEventType =
  | 'LEAD_CREATED'
  | 'QUOTE_READY'
  | 'APPLICATION_CREATED'
  | 'DOCUMENT_REQUIRED'
  | 'DOCUMENT_APPROVED'
  | 'DOCUMENT_REJECTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'POLICY_ISSUED'
  | 'CLAIM_CREATED'
  | 'CLAIM_UPDATED'
  | 'RENEWAL_UPCOMING'
  | 'RENEWAL_DUE'
  | 'RENEWAL_OVERDUE';

export interface SendNotificationRequest {
  eventType: NotificationEventType;
  template: string;
  channel: NotificationChannel;
  recipient: string;
  payload?: Record<string, any>;
  customerId?: string;
  userId?: string;
}

export interface ProviderSendResult {
  accepted: boolean;
  providerReference?: string;
  status: NotificationDeliveryStatus;
  providerName: string;
}

export interface NotificationProvider {
  readonly providerName: string;
  send(request: SendNotificationRequest): Promise<ProviderSendResult>;
  getDeliveryStatus(providerReference: string): Promise<NotificationDeliveryStatus>;
  canHandle(channel: NotificationChannel): boolean;
}
