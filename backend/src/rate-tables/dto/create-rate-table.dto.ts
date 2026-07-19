import { IsString, IsNotEmpty, IsObject, IsNumber } from 'class-validator';

export class CreateRateTableDto {
  @IsString()
  @IsNotEmpty()
  vertical: string;

  @IsString()
  @IsNotEmpty()
  partnerId: string;

  @IsString()
  @IsNotEmpty()
  planName: string;

  @IsObject()
  @IsNotEmpty()
  criteria: any;

  @IsNumber()
  @IsNotEmpty()
  premiumMin: number;

  @IsNumber()
  @IsNotEmpty()
  premiumMax: number;
}
