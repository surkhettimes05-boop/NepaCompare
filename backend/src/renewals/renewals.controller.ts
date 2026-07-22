import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { RenewalsService } from './renewals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('renewals')
export class RenewalsController {
  constructor(private readonly renewalsService: RenewalsService) {}

  @Get('my-policies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  async getMyPolicies(@Request() req) {
    return this.renewalsService.getPoliciesForUser(req.user.userId);
  }

  @Get('expiring-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  async getAllExpiringPolicies() {
    return this.renewalsService.getAllExpiringPolicies();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post(':id/renew')
  async renewPolicy(@Param('id') id: string, @Request() req: any) {
    return this.renewalsService.renewPolicy(id, req.user.userId);
  }
}
