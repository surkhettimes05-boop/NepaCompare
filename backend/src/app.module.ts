import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { PartnersModule } from './partners/partners.module';
import { RateTablesModule } from './rate-tables/rate-tables.module';

@Module({
  imports: [AuthModule, LeadsModule, PartnersModule, RateTablesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
