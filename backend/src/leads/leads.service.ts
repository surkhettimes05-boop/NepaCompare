import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeadsService {

  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        vertical: createLeadDto.vertical,
        source: createLeadDto.source,
        formData: createLeadDto.formData,
      },
    });
  }

  findAll() {
    return this.prisma.lead.findMany({
      include: { partner: true, staff: true, user: true }
    });
  }

  findOne(id: string) {
    return this.mockLeads.find(l => l.id === id);
  }

  update(id: string, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: string) {
    this.mockLeads = this.mockLeads.filter(l => l.id !== id);
    return `This action removes a #${id} lead`;
  }
}
