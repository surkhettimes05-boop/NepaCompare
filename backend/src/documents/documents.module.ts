import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from '../prisma.service';
import { ObjectStorageService } from './object-storage.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService, ObjectStorageService],
  exports: [DocumentsService, ObjectStorageService],
})
export class DocumentsModule {}
