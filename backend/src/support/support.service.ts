import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async getTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTicket(userId: string, data: { subject: string; description: string }) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject: data.subject,
        description: data.description,
      },
    });
  }
}
