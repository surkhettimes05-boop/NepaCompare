import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('seo')
export class SeoController {
  constructor(private prisma: PrismaService) {}

  @Get('insurers')
  async getInsurers() {
    return this.prisma.partner.findMany({
      where: { type: 'INSURER' },
      select: {
        slug: true,
        name: true,
        founded: true,
        branches: true,
        claimRatio: true,
      },
    });
  }

  @Get('cities')
  async getCities() {
    return this.prisma.city.findMany({
      select: {
        slug: true,
        name: true,
        population: true,
        agentsCount: true,
        popularType: true,
      },
    });
  }

  @Get('vehicles')
  async getVehicles() {
    return this.prisma.vehicleModel.findMany({
      select: {
        slug: true,
        brand: true,
        brandSlug: true,
        name: true,
        cc: true,
        basePremium: true,
        type: true,
      },
    });
  }
}
