import { Module } from '@nestjs/common';
import { RatingEngineService } from './rating-engine.service';

@Module({
  providers: [RatingEngineService],
  exports: [RatingEngineService],
})
export class RatingEngineModule {}
