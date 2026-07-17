import { Module } from '@nestjs/common';
import { RateTablesService } from './rate-tables.service';
import { RateTablesController } from './rate-tables.controller';

@Module({
  controllers: [RateTablesController],
  providers: [RateTablesService],
})
export class RateTablesModule {}
