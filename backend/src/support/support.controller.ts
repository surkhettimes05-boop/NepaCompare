import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  async getTickets(@Request() req) {
    const userId = req.user.sub || req.user.id;
    return this.supportService.getTickets(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  async createTicket(
    @Request() req,
    @Body() body: { subject: string; description: string }
  ) {
    const userId = req.user.sub || req.user.id;
    return this.supportService.createTicket(userId, body);
  }
}
