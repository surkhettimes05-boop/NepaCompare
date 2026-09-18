import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateInsurerDto } from './dto/create-insurer.dto';
import { UpdateInsurerDto } from './dto/update-insurer.dto';
import { CreateInsuranceProductDto } from './dto/create-product.dto';
import { UpdateInsuranceProductDto } from './dto/update-product.dto';

@Injectable()
export class InsurersService {
  constructor(private readonly prisma: PrismaService) {}

  async createInsurer(dto: CreateInsurerDto) {
    const insurerData: Prisma.InsurerCreateInput = {
      legalName: dto.legalName,
      displayName: dto.displayName,
      status: dto.status ?? 'PROSPECT',
      regulatoryBody: dto.regulatoryBody,
      regulatoryLicenseNumber: dto.regulatoryLicenseNumber,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      integrationStatus: dto.integrationStatus ?? 'NOT_CONNECTED',
      supportedProducts: dto.supportedQuoteSources ? { quoteSources: dto.supportedQuoteSources } : undefined,
      supportedQuoteSources: dto.supportedQuoteSources ? dto.supportedQuoteSources : undefined,
      providerCapabilities: dto.providerCapabilities ? dto.providerCapabilities : undefined,
      adapterConfig: dto.adapterConfig ?? undefined,
      operationalContacts: dto.operationalContacts ?? undefined,
      productAvailability: dto.productAvailability ?? undefined,
      effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
      effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      onboardingNotes: dto.onboardingNotes,
    };

    return this.prisma.insurer.create({ data: insurerData });
  }

  async listInsurers() {
    const insurers = await this.prisma.insurer.findMany({
      include: {
        insuranceProducts: true,
        quotes: true,
        policies: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return insurers.map((insurer) => ({
      ...insurer,
      quoteCount: insurer.quotes.length,
      policyCount: insurer.policies.length,
      quoteConversionRate: insurer.quotes.length > 0 ? Number(((insurer.policies.length / insurer.quotes.length) * 100).toFixed(2)) : 0,
      premiumVolume: insurer.policies.reduce((sum, policy) => sum + Number(policy.premium || 0), 0),
      failureCount: 0,
    }));
  }

  async getInsurer(id: string) {
    const insurer = await this.prisma.insurer.findUnique({
      where: { id },
      include: {
        insuranceProducts: true,
        quotes: true,
        policies: true,
      },
    });

    if (!insurer) {
      throw new NotFoundException(`Insurer ${id} not found`);
    }

    return {
      ...insurer,
      quoteCount: insurer.quotes.length,
      policyCount: insurer.policies.length,
      quoteConversionRate: insurer.quotes.length > 0 ? Number(((insurer.policies.length / insurer.quotes.length) * 100).toFixed(2)) : 0,
      premiumVolume: insurer.policies.reduce((sum, policy) => sum + Number(policy.premium || 0), 0),
      failureCount: 0,
    };
  }

  async updateInsurer(id: string, dto: UpdateInsurerDto) {
    const insurer = await this.prisma.insurer.findUnique({ where: { id } });
    if (!insurer) {
      throw new NotFoundException(`Insurer ${id} not found`);
    }

    return this.prisma.insurer.update({
      where: { id },
      data: {
        ...dto,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      },
    });
  }

  async deleteInsurer(id: string) {
    const insurer = await this.prisma.insurer.findUnique({ where: { id } });
    if (!insurer) {
      throw new NotFoundException(`Insurer ${id} not found`);
    }
    return this.prisma.insurer.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'OFFBOARDED' },
    });
  }

  async createProduct(insurerId: string, dto: CreateInsuranceProductDto) {
    const insurer = await this.prisma.insurer.findUnique({ where: { id: insurerId } });
    if (!insurer) {
      throw new NotFoundException(`Insurer ${insurerId} not found`);
    }

    return this.prisma.insuranceProduct.create({
      data: {
        insurerId,
        name: dto.name,
        code: dto.code,
        productType: dto.productType,
        description: dto.description,
        status: dto.status ?? 'ACTIVE',
        active: dto.active ?? true,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
        supportedQuoteSources: dto.supportedQuoteSources ? dto.supportedQuoteSources : undefined,
        capabilities: dto.capabilities ?? undefined,
        coverageMetadata: dto.coverageMetadata ?? undefined,
        exclusionsMetadata: dto.exclusionsMetadata ?? undefined,
        configuration: dto.configuration ?? undefined,
      },
    });
  }

  async listProducts(insurerId?: string) {
    return this.prisma.insuranceProduct.findMany({
      where: insurerId ? { insurerId } : undefined,
      include: {
        coverages: true,
        addOns: true,
        quotes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProduct(id: string) {
    const product = await this.prisma.insuranceProduct.findUnique({
      where: { id },
      include: {
        coverages: true,
        addOns: true,
        quotes: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async updateProduct(id: string, dto: UpdateInsuranceProductDto) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return this.prisma.insuranceProduct.update({
      where: { id },
      data: {
        ...dto,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
      },
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return this.prisma.insuranceProduct.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED', active: false },
    });
  }

  async createCoverage(productId: string, dto: any) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return this.prisma.coverage.create({
      data: {
        insuranceProductId: productId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        limitAmount: dto.limitAmount ? Number(dto.limitAmount) : undefined,
        limitUnit: dto.limitUnit,
        exclusionsMetadata: dto.exclusionsMetadata ?? undefined,
        isMandatory: dto.isMandatory ?? false,
      },
    });
  }

  async listCoverages(productId: string) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return this.prisma.coverage.findMany({
      where: { insuranceProductId: productId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAddOn(productId: string, dto: any) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return this.prisma.insuranceAddOn.create({
      data: {
        insuranceProductId: productId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        active: dto.active ?? true,
        premiumAdjustment: dto.premiumAdjustment ? Number(dto.premiumAdjustment) : undefined,
        coverageMetadata: dto.coverageMetadata ?? undefined,
        exclusionsMetadata: dto.exclusionsMetadata ?? undefined,
      },
    });
  }

  async listAddOns(productId: string) {
    const product = await this.prisma.insuranceProduct.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return this.prisma.insuranceAddOn.findMany({
      where: { insuranceProductId: productId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
