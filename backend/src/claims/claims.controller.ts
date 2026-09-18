import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';
import { ClaimsService } from './claims.service';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.APPLICATIONS_VIEW)
  @Post('report')
  reportClaim(@Body() body: any, @Req() req: any) {
    return this.claimsService.reportClaim({
      policyId: body.policyId,
      customerId: body.customerId || req.user?.userId || req.user?.id,
      description: body.description,
      incidentDate: body.incidentDate ? new Date(body.incidentDate) : undefined,
      metadata: body.metadata || {},
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.APPLICATIONS_VIEW)
  @Get('customer/:customerId')
  getCustomerClaims(@Param('customerId') customerId: string) {
    return this.claimsService.findByCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.APPLICATIONS_UPDATE)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.claimsService.updateStatus(id, body.status, req.user?.userId || req.user?.id, body.note);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.APPLICATIONS_UPDATE)
  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.claimsService.addNote(id, { authorId: req.user?.userId || req.user?.id, message: body.message });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.APPLICATIONS_UPDATE)
  @Post(':id/communications')
  recordCommunication(@Param('id') id: string, @Body() body: any) {
    return this.claimsService.recordCommunication(id, {
      channel: body.channel,
      direction: body.direction,
      note: body.note,
      insurerReference: body.insurerReference,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.APPLICATIONS_UPDATE)
  @Patch(':id/insurer-reference')
  setInsurerReference(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.claimsService.setInsurerReference(id, body.insurerReference, req.user?.userId || req.user?.id);
  }
}
