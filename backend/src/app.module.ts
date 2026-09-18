import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { PartnersModule } from './partners/partners.module';
import { RateTablesModule } from './rate-tables/rate-tables.module';
import { QuotesModule } from './quotes/quotes.module';
import { UsersModule } from './users/users.module';
import { InsurersModule } from './insurers/insurers.module';
import { ChatModule } from './chat/chat.module';
import { RenewalsModule } from './renewals/renewals.module';
import { RatingEngineModule } from './rating-engine/rating-engine.module';
import { WellnessModule } from './wellness/wellness.module';
import { SupportModule } from './support/support.module';
import { SeoModule } from './seo/seo.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';
import { KycModule } from './kyc/kyc.module';
import { PaymentsModule } from './payments/payments.module';
import { ClaimsModule } from './claims/claims.module';
import { FinanceModule } from './finance/finance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailProvider, SmsProvider, WhatsAppProvider, InAppProvider } from './notifications/example-providers';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule, 
    LeadsModule, 
    PartnersModule, 
    RateTablesModule, 
    QuotesModule, 
    UsersModule,
    InsurersModule,
    ChatModule,
    ApplicationsModule,
    DocumentsModule,
    KycModule,
    PaymentsModule,
    ClaimsModule,
    FinanceModule,
    NotificationsModule,
    AnalyticsModule,
    RenewalsModule,
    RatingEngineModule,
    WellnessModule,
    SupportModule,
    SeoModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailProvider,
    SmsProvider,
    WhatsAppProvider,
    InAppProvider,
    {
      provide: 'NOTIFICATION_PROVIDERS',
      useFactory: (email, sms, whatsapp, inApp) => [email, sms, whatsapp, inApp],
      inject: [EmailProvider, SmsProvider, WhatsAppProvider, InAppProvider],
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
