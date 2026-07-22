import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AppointmentType } from '@prisma/client';

@Injectable()
export class WellnessService {
  constructor(private prisma: PrismaService) {}

  async getAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  async createAppointment(userId: string, data: { type: AppointmentType; providerName: string; date: string }) {
    return this.prisma.appointment.create({
      data: {
        userId,
        type: data.type,
        providerName: data.providerName,
        date: new Date(data.date),
      },
    });
  }
}
