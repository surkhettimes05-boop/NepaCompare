import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ClaimsController],
  providers: [ClaimsService, PrismaService],
  exports: [ClaimsService],
})
export class ClaimsModule {}
