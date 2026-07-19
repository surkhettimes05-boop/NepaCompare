import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { PrismaService } from '../prisma.service';
import { RatingEngineModule } from '../rating-engine/rating-engine.module';

@Module({
  imports: [RatingEngineModule],
  controllers: [QuotesController],
  providers: [QuotesService, PrismaService],
})
export class QuotesModule {}
