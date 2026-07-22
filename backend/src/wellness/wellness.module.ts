import { Module } from '@nestjs/common';
import { WellnessController } from './wellness.controller';
import { WellnessService } from './wellness.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WellnessController],
  providers: [WellnessService, PrismaService]
})
export class WellnessModule {}
