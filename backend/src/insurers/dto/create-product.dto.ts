import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { InsuranceProductStatus, InsuranceProductType } from '@prisma/client';

export class CreateInsuranceProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(InsuranceProductType)
  @IsNotEmpty()
  productType: InsuranceProductType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(InsuranceProductStatus)
  status?: InsuranceProductStatus;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsOptional()
  @IsArray()
  supportedQuoteSources?: string[];

  @IsOptional()
  @IsArray()
  capabilities?: Record<string, any>[];

  @IsOptional()
  @IsObject()
  coverageMetadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  exclusionsMetadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;
}
