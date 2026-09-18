import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InsurersController } from './insurers.controller';
import { InsurersService } from './insurers.service';

@Module({
  controllers: [InsurersController],
  providers: [InsurersService, PrismaService],
  exports: [InsurersService],
})
export class InsurersModule {}
