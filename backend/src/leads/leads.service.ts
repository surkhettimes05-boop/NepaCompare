import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeadsService {

  constructor(private prisma: PrismaService) {}

  private getLeadPhone(formData: any): string | null {
    if (!formData || typeof formData !== 'object') {
      return null;
    }

    const phoneCandidate = [
      formData.phone,
      formData.mobile,
      formData.phoneNumber,
      formData.contactPhone,
    ].find((value) => typeof value === 'string' && value.trim().length > 0);

    return phoneCandidate ? phoneCandidate.trim() : null;
  }

  async create(createLeadDto: CreateLeadDto, userId?: string) {
    const phone = this.getLeadPhone(createLeadDto.formData);

    if (phone) {
      const duplicate = await this.prisma.lead.findFirst({
        where: {
          vertical: createLeadDto.vertical,
          formData: {
            path: ['phone'],
            equals: phone,
          },
        },
      });

      if (duplicate) {
        return {
          duplicate: true,
          id: duplicate.id,
          message: 'A lead already exists for this customer and product.',
        };
      }
    }

    const created = await this.prisma.lead.create({
      data: {
        vertical: createLeadDto.vertical,
        source: createLeadDto.source,
        formData: {
          ...createLeadDto.formData,
          phone,
        },
        userId,
      },
    });

    return { duplicate: false, ...created };
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

    const customerId = lead.customerId || (await this.prisma.customer.findFirst({ where: { userId } }))?.id;
    if (!customerId) {
      throw new Error('Customer profile is required before conversion');
    }

    const duplicatePolicy = await this.prisma.policy.findFirst({
      where: {
        customerId,
        status: { in: ['ACTIVE', 'EXPIRING_SOON'] },
      },
    });

    if (duplicatePolicy && duplicatePolicy.applicationId === lead.id) {
      throw new Error('A policy for this customer and vertical already exists');
    }

    if (duplicatePolicy) {
      throw new Error('A policy for this customer and vertical already exists');
    }

    return this.prisma.$transaction(async (tx) => {
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

      const policy = await tx.policy.create({
        data: {
          customerId,
          partnerId: lead.partnerId || undefined,
          premium: 15000,
          startDate: new Date(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'ACTIVE',
          applicationId: lead.id,
        }
      });

      return { ...policy, lead: updatedLead };
    });
  }
}
