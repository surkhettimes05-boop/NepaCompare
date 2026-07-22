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
import { ChatModule } from './chat/chat.module';
import { RenewalsModule } from './renewals/renewals.module';
import { RatingEngineModule } from './rating-engine/rating-engine.module';
import { WellnessModule } from './wellness/wellness.module';
import { SupportModule } from './support/support.module';
import { SeoModule } from './seo/seo.module';

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
    ChatModule, 
    RenewalsModule, 
    RatingEngineModule, 
    WellnessModule, 
    SupportModule,
    SeoModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
