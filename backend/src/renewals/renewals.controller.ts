import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RenewalsService } from './renewals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';

@Controller('renewals')
export class RenewalsController {
  constructor(private readonly renewalsService: RenewalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Get('my-policies')
  getMyPolicies(@Req() req: any) {
    return this.renewalsService.getPoliciesForUser(req.user.userId || req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.SALES)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Get('dashboard')
  getDashboard() {
    return this.renewalsService.getRenewalsDashboard();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.SALES)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Get('analytics')
  getAnalytics() {
    return this.renewalsService.getRenewalAnalytics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.SALES)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Get('expiring')
  getAllExpiringPolicies() {
    return this.renewalsService.getAllExpiringPolicies();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Post(':policyId/ensure')
  ensure(@Param('policyId') policyId: string) {
    return this.renewalsService.ensureRenewalForPolicy(policyId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.renewalsService.markRenewalStatus(id, body.status, req.user?.userId || req.user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Post(':id/notifications')
  createNotification(@Param('id') id: string, @Body() body: any) {
    return this.renewalsService.createNotification(id, body.channel, body.provider, body.payload || {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @RequirePermissions(Permission.POLICIES_VIEW)
  @Post(':id/renew')
  renewPolicy(@Param('id') id: string, @Req() req: any) {
    return this.renewalsService.renewPolicy(id, req.user.userId || req.user.id);
  }
}
