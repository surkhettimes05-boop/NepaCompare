import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { InsurerStatus, IntegrationStatus } from '@prisma/client';

export class CreateInsurerDto {
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsOptional()
  @IsEnum(InsurerStatus)
  status?: InsurerStatus;

  @IsOptional()
  @IsString()
  regulatoryBody?: string;

  @IsOptional()
  @IsString()
  regulatoryLicenseNumber?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsEnum(IntegrationStatus)
  integrationStatus?: IntegrationStatus;

  @IsOptional()
  @IsArray()
  supportedQuoteSources?: string[];

  @IsOptional()
  @IsArray()
  providerCapabilities?: Record<string, any>[];

  @IsOptional()
  @IsObject()
  adapterConfig?: Record<string, any>;

  @IsOptional()
  @IsArray()
  operationalContacts?: Record<string, any>[];

  @IsOptional()
  @IsObject()
  productAvailability?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsOptional()
  @IsString()
  onboardingNotes?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
