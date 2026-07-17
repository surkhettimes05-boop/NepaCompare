import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RateTablesService } from './rate-tables.service';
import { CreateRateTableDto } from './dto/create-rate-table.dto';
import { UpdateRateTableDto } from './dto/update-rate-table.dto';

@Controller('rate-tables')
export class RateTablesController {
  constructor(private readonly rateTablesService: RateTablesService) {}

  @Post()
  create(@Body() createRateTableDto: CreateRateTableDto) {
    return this.rateTablesService.create(createRateTableDto);
  }

  @Get()
  findAll() {
    return this.rateTablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateTablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateTableDto: UpdateRateTableDto) {
    return this.rateTablesService.update(+id, updateRateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateTablesService.remove(+id);
  }
}
