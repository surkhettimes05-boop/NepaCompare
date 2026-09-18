import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RequirePermissions, Roles } from '../auth/roles.decorator';
import { Permission } from '@prisma/client';
import { CreateInsurerDto } from './dto/create-insurer.dto';
import { UpdateInsurerDto } from './dto/update-insurer.dto';
import { CreateInsuranceProductDto } from './dto/create-product.dto';
import { UpdateInsuranceProductDto } from './dto/update-product.dto';
import { InsurersService } from './insurers.service';

@Controller('insurers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsurersController {
  constructor(private readonly insurersService: InsurersService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.INSURERS_MANAGE)
  @Post()
  createInsurer(@Body() dto: CreateInsurerDto) {
    return this.insurersService.createInsurer(dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.INSURERS_MANAGE)
  @Get()
  listInsurers() {
    return this.insurersService.listInsurers();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.INSURERS_MANAGE)
  @Get(':id')
  getInsurer(@Param('id') id: string) {
    return this.insurersService.getInsurer(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.INSURERS_MANAGE)
  @Patch(':id')
  updateInsurer(@Param('id') id: string, @Body() dto: UpdateInsurerDto) {
    return this.insurersService.updateInsurer(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.INSURERS_MANAGE)
  @Delete(':id')
  deleteInsurer(@Param('id') id: string) {
    return this.insurersService.deleteInsurer(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Post(':id/products')
  createProduct(@Param('id') insurerId: string, @Body() dto: CreateInsuranceProductDto) {
    return this.insurersService.createProduct(insurerId, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Get(':id/products')
  listProducts(@Param('id') id: string) {
    return this.insurersService.listProducts(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS, Role.FINANCE)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Get('products/:productId')
  getProduct(@Param('productId') productId: string) {
    return this.insurersService.getProduct(productId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Patch('products/:productId')
  updateProduct(@Param('productId') productId: string, @Body() dto: UpdateInsuranceProductDto) {
    return this.insurersService.updateProduct(productId, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Delete('products/:productId')
  deleteProduct(@Param('productId') productId: string) {
    return this.insurersService.deleteProduct(productId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Post('products/:productId/coverages')
  createCoverage(@Param('productId') productId: string, @Body() dto: any) {
    return this.insurersService.createCoverage(productId, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Get('products/:productId/coverages')
  listCoverages(@Param('productId') productId: string) {
    return this.insurersService.listCoverages(productId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Post('products/:productId/add-ons')
  createAddOn(@Param('productId') productId: string, @Body() dto: any) {
    return this.insurersService.createAddOn(productId, dto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.OPERATIONS)
  @RequirePermissions(Permission.PRODUCTS_MANAGE)
  @Get('products/:productId/add-ons')
  listAddOns(@Param('productId') productId: string) {
    return this.insurersService.listAddOns(productId);
  }
}
