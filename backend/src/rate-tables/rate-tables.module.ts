import { Module } from '@nestjs/common';
import { RateTablesService } from './rate-tables.service';
import { RateTablesController } from './rate-tables.controller';

import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RateTablesController],
  providers: [RateTablesService, PrismaService],
})
export class RateTablesModule {}
