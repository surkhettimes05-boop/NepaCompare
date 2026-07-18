import { Controller, Get, Query } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  getQuotes(@Query('vertical') vertical: string, @Query() criteria: any) {
    if (!vertical) {
      return [];
    }
    return this.quotesService.getQuotes(vertical, criteria);
  }
}
