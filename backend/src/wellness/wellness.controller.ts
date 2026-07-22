import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WellnessService } from './wellness.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentType } from '@prisma/client';

@Controller('wellness')
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @UseGuards(JwtAuthGuard)
  @Get('appointments')
  async getAppointments(@Request() req) {
    // Only CUSTOMER roles book appointments, req.user holds the JWT payload
    const userId = req.user.sub || req.user.id;
    return this.wellnessService.getAppointments(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('appointments')
  async createAppointment(
    @Request() req,
    @Body() body: { type: AppointmentType; providerName: string; date: string }
  ) {
    const userId = req.user.sub || req.user.id;
    return this.wellnessService.createAppointment(userId, body);
  }
}
