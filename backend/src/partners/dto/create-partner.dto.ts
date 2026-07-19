import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { PartnerType } from '@prisma/client';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PartnerType)
  @IsNotEmpty()
  type: PartnerType;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsArray()
  verticals?: any[];

  @IsOptional()
  @IsArray()
  regions?: any[];

  @IsOptional()
  @IsNumber()
  agreedCpl?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
