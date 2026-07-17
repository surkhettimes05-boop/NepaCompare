import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeadsService {
  private mockLeads: any[] = [
    { id: '1', vertical: 'motor', source: 'web', createdAt: new Date().toISOString(), formData: { name: 'Rajesh Shrestha', phone: '9841234567' } },
    { id: '2', vertical: 'health', source: 'web', createdAt: new Date().toISOString(), formData: { name: 'Sunita Gurung', phone: '9851234567', age: '35' } }
  ];

  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    const newLead = {
      id: Math.random().toString(36).substring(7),
      vertical: createLeadDto.vertical,
      source: createLeadDto.source,
      formData: createLeadDto.formData,
      createdAt: new Date().toISOString(),
    };
    this.mockLeads.unshift(newLead); // Add to beginning of list
    return newLead;
  }

  findAll() {
    return this.mockLeads;
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
