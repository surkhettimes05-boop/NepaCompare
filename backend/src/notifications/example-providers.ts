import { NotificationChannel, NotificationDeliveryStatus, NotificationProvider, SendNotificationRequest } from './notification-provider.interface';

export class EmailProvider implements NotificationProvider {
  readonly providerName = 'EMAIL_PROVIDER';
  async send(_request: SendNotificationRequest) {
    return {
      accepted: true,
      providerReference: `email-${Date.now()}`,
      status: 'DELIVERED' as const,
      providerName: this.providerName,
    };
  }
  getDeliveryStatus(providerReference: string): Promise<NotificationDeliveryStatus> {
    return Promise.resolve(providerReference ? 'DELIVERED' : 'FAILED');
  }
  canHandle(channel: NotificationChannel): boolean {
    return channel === 'EMAIL';
  }
}

export class SmsProvider implements NotificationProvider {
  readonly providerName = 'SMS_PROVIDER';
  async send(_request: SendNotificationRequest) {
    return {
      accepted: true,
      providerReference: `sms-${Date.now()}`,
      status: 'SENT' as const,
      providerName: this.providerName,
    };
  }
  getDeliveryStatus(providerReference: string): Promise<NotificationDeliveryStatus> {
    return Promise.resolve(providerReference ? 'SENT' : 'FAILED');
  }
  canHandle(channel: NotificationChannel): boolean {
    return channel === 'SMS';
  }
}

export class WhatsAppProvider implements NotificationProvider {
  readonly providerName = 'WHATSAPP_PROVIDER';
  async send(_request: SendNotificationRequest) {
    return {
      accepted: true,
      providerReference: `wa-${Date.now()}`,
      status: 'DELIVERED' as const,
      providerName: this.providerName,
    };
  }
  getDeliveryStatus(providerReference: string): Promise<NotificationDeliveryStatus> {
    return Promise.resolve(providerReference ? 'DELIVERED' : 'FAILED');
  }
  canHandle(channel: NotificationChannel): boolean {
    return channel === 'WHATSAPP';
  }
}

export class InAppProvider implements NotificationProvider {
  readonly providerName = 'IN_APP_PROVIDER';
  async send(_request: SendNotificationRequest) {
    return {
      accepted: true,
      providerReference: `inapp-${Date.now()}`,
      status: 'DELIVERED' as const,
      providerName: this.providerName,
    };
  }
  getDeliveryStatus(providerReference: string): Promise<NotificationDeliveryStatus> {
    return Promise.resolve(providerReference ? 'DELIVERED' : 'FAILED');
  }
  canHandle(channel: NotificationChannel): boolean {
    return channel === 'IN_APP';
  }
}
