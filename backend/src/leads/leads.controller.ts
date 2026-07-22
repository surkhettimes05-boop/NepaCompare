import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
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
  @Roles(Role.AGENT, Role.ADMIN)
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
