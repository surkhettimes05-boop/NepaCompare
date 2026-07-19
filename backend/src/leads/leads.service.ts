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
    return this.prisma.lead.findUnique({ where: { id }, include: { partner: true, staff: true, user: true } });
  }

  update(id: string, updateLeadDto: UpdateLeadDto) {
    return this.prisma.lead.update({
      where: { id },
      data: updateLeadDto as any
    });
  }

  remove(id: string) {
    return this.prisma.lead.delete({ where: { id } });
  }
}
