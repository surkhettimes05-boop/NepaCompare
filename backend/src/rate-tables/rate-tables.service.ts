import { Injectable } from '@nestjs/common';
import { CreateRateTableDto } from './dto/create-rate-table.dto';
import { UpdateRateTableDto } from './dto/update-rate-table.dto';

@Injectable()
export class RateTablesService {
  create(createRateTableDto: CreateRateTableDto) {
    return 'This action adds a new rateTable';
  }

  findAll() {
    return `This action returns all rateTables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rateTable`;
  }

  update(id: number, updateRateTableDto: UpdateRateTableDto) {
    return `This action updates a #${id} rateTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} rateTable`;
  }
}
