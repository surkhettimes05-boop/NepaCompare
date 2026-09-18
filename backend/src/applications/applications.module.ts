import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaService } from '../prisma.service';
import { ObjectStorageService } from '../documents/object-storage.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaService, ObjectStorageService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
