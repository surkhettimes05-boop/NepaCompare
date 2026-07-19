import { Module } from '@nestjs/common';
import { RenewalsController } from './renewals.controller';
import { RenewalsService } from './renewals.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RenewalsController],
  providers: [RenewalsService, PrismaService],
})
export class RenewalsModule {}
