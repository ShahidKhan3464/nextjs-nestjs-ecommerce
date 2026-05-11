import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '../constants/product.constants';
import {
  Min,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
