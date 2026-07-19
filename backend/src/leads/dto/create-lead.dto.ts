import { IsString, IsNotEmpty, IsObject, IsOptional, IsEnum } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  vertical: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsObject()
  @IsNotEmpty()
  formData: any;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}
