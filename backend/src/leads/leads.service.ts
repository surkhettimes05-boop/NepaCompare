import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeadsService {

  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: any) {
    return this.prisma.lead.create({
      data: {
        vertical: createLeadDto.vertical,
        source: createLeadDto.source,
        formData: createLeadDto.formData,
        userId: createLeadDto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.lead.findMany({
      include: { partner: true, staff: true, user: true }
    });
  }

  findOne(id: string) {
    return this.prisma.lead.findUnique({ 
      where: { id }, 
      include: { 
        partner: true, 
        staff: true, 
        user: true,
        statusHistory: {
          include: { changedBy: true },
          orderBy: { changedAt: 'desc' }
        }
      } 
    });
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

  async routeLead(id: string, partnerId: string, staffId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new Error('Lead not found');

    const oldStatus = lead.status;
    const newStatus = 'SENT_TO_PARTNER';

    return this.prisma.$transaction(async (tx) => {
      const updatedLead = await tx.lead.update({
        where: { id },
        data: {
          partnerId,
          status: newStatus,
        }
      });

      await tx.leadStatusHistory.create({
        data: {
          leadId: id,
          oldStatus,
          newStatus,
          changedById: staffId
        }
      });

      return updatedLead;
    });
  }

  async buyLead(id: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead || lead.userId !== userId) {
      throw new Error('Lead not found or unauthorized');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Mark lead as converted
      const updatedLead = await tx.lead.update({
        where: { id },
        data: { status: 'CONVERTED' }
      });

      await tx.leadStatusHistory.create({
        data: {
          leadId: id,
          oldStatus: lead.status,
          newStatus: 'CONVERTED'
        }
      });

      // 2. Generate the policy
      const formData: any = lead.formData;
      const policy = await tx.policy.create({
        data: {
          userId,
          insurer: 'Partner Insurer', // Mock since we don't store selected insurer in lead yet
          planName: `${lead.vertical} Policy`,
          vertical: lead.vertical,
          premium: 15000, // Mock premium for now
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'ACTIVE'
        }
      });

      return policy;
    });
  }
}
