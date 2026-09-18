import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission, Role } from '@prisma/client';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.DOCUMENTS_UPLOAD)
  @Post('upload')
  upload(@Body() body: any, @Req() req: any) {
    return this.documentsService.uploadDocument({
      ...body,
      uploaderId: body.uploaderId || req.user?.userId || req.user?.id,
      uploadedByRole: req.user?.role,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.DOCUMENTS_VIEW)
  @Get(':id/url')
  async getSignedUrl(@Param('id') id: string, @Req() req: any) {
    return this.documentsService.getDocumentSignedUrl(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.CUSTOMER_SUPPORT)
  @RequirePermissions(Permission.DOCUMENTS_UPLOAD)
  @Patch(':id/verify')
  verify(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.documentsService.verifyDocument(id, body.status, body.reason || '', req.user?.userId || req.user?.id);
  }
}
