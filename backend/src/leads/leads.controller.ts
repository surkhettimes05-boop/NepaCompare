import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: CreateLeadDto, @Req() req: any) {
    // ValidationPipe will automatically validate CreateLeadDto
    // Public quote requests remain unowned; only a verified customer may attach one to their account.
    const userId = req.user?.role === Role.CUSTOMER ? req.user.userId : undefined;
    return this.leadsService.create(createLeadDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SALES, Role.OPERATIONS, Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.LEADS_VIEW)
  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SALES, Role.OPERATIONS, Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.LEADS_VIEW)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SALES, Role.OPERATIONS, Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.LEADS_CREATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SALES, Role.OPERATIONS, Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.LEADS_ASSIGN)
  @Patch(':id/route')
  routeLead(
    @Param('id') id: string,
    @Body('partnerId') partnerId: string,
    @Req() req: any,
  ) {
    // req.user is populated by JwtAuthGuard
    const staffId = req.user.userId;
    return this.leadsService.routeLead(id, partnerId, staffId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SALES, Role.OPERATIONS, Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.LEADS_CREATE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post(':id/buy')
  buyLead(@Param('id') id: string, @Req() req: any) {
    return this.leadsService.buyLead(id, req.user.userId);
  }
}
