export type RenewalState =
  | 'UPCOMING'
  | 'CONTACT_PENDING'
  | 'CONTACTED'
  | 'QUOTE_REQUESTED'
  | 'QUOTE_RECEIVED'
  | 'CUSTOMER_DECIDING'
  | 'RENEWED'
  | 'LOST'
  | 'EXPIRED'
  | 'CANCELLED';

export type NotificationChannel = 'SMS' | 'EMAIL' | 'WHATSAPP' | 'IN_APP';

export interface RenewalReminderConfigItem {
  name: string;
  daysBefore: number;
  active: boolean;
}

export interface RenewalAnalyticsSummary {
  renewalRate: number;
  contactedRate: number;
  quoteRate: number;
  renewalConversion: number;
  renewalPremium: number;
  renewalCommission: number;
}
