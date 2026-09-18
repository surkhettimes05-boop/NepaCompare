import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnalyticsService } from './analytics.service';

@Module({
  providers: [AnalyticsService, PrismaService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
