import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('partners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Get('me/dashboard')
  getMyDashboard(@Req() req: any) {
    return this.partnersService.getPartnerDashboard(req.user.partnerId, req.user);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Get('me/leads')
  getMyLeads(@Req() req: any) {
    return this.partnersService.getPartnerLeads(req.user.partnerId, req.user);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Get('me/customers')
  getMyCustomers(@Req() req: any) {
    return this.partnersService.getPartnerCustomers(req.user.partnerId, req.user);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Get('me/policies')
  getMyPolicies(@Req() req: any) {
    return this.partnersService.getPartnerPolicies(req.user.partnerId, req.user);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Get('me/commissions')
  getMyCommissions(@Req() req: any) {
    return this.partnersService.getPartnerCommissions(req.user.partnerId, req.user);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'PARTNER' && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && req.user.role !== 'OPERATIONS') {
      throw new Error('Unauthorized');
    }

    if (req.user.role === 'PARTNER' && req.user.partnerId !== id) {
      throw new Error('Access denied');
    }

    return this.partnersService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.PARTNER)
  @Post(':id/attribution')
  assignLeadAttribution(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (req.user.role === 'PARTNER' && req.user.partnerId !== id) {
      throw new Error('Access denied');
    }

    return this.partnersService.assignLeadAttribution(body.leadId, id, req.user?.userId || req.user?.id || req.user?.partnerId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @Get(':id/performance')
  getPartnerPerformance(@Param('id') id: string) {
    return this.partnersService.getPartnerPerformance(id);
  }
}
