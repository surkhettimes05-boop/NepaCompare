import { Controller, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.DOCUMENTS_UPLOAD)
  @Post('create')
  create(@Body() body: any, @Req() req: any) {
    return this.kycService.createKyc(body.customerId || req.user?.userId, body.verificationMethod || 'MANUAL', body.metadata || {});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.DOCUMENTS_UPLOAD)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.kycService.updateKycStatus(id, body.status, req.user?.userId || req.user?.id, body.details || '');
  }
}
