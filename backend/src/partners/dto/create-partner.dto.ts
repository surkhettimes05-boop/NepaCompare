import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { PartnerStatus, PartnerType } from '@prisma/client';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsEnum(PartnerType)
  @IsNotEmpty()
  type: PartnerType;

  @IsOptional()
  @IsEnum(PartnerStatus)
  status?: PartnerStatus;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsArray()
  verticals?: string[];

  @IsOptional()
  @IsArray()
  regions?: string[];

  @IsOptional()
  @IsNumber()
  agreedCpl?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
