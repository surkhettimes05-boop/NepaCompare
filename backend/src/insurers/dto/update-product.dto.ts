import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceProductDto } from './create-product.dto';

export class UpdateInsuranceProductDto extends PartialType(CreateInsuranceProductDto) {}
