import { Controller, Get, Post, Param, Body, UseGuards, Req, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.APPLICATIONS_VIEW)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.applicationsService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.SALES)
  @RequirePermissions(Permission.APPLICATIONS_UPDATE)
  @Post(':id/submit-review')
  submitReview(@Param('id') id: string, @Req() req: any) {
    return this.applicationsService.submitForReview(id, req.user?.userId || req.user?.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.DOCUMENTS_UPLOAD)
  @Patch(':id/documents/replace')
  replaceDocument(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.applicationsService.replaceDocument(id, body.documentId, body.newDocumentId, req.user?.userId || req.user?.id);
  }
}
