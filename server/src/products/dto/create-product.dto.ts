import { Transform, Type } from 'class-transformer';
import { ProductStatus } from '../constants/product.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Min,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

/** Form fields for `multipart/form-data` product creation (files use field `images`) */
export class CreateProductDto {
  @ApiProperty()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf(
    (_, v) => v !== undefined && v !== null && String(v).trim() !== '',
  )
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  /** JSON array string of variant objects (size, color, sku, stock, price) */
  @ApiProperty({
    description: 'JSON stringified array of variants',
    example:
      '[{"size":"M","color":"Black","sku":"ABC-1","stock":10,"price":99.99}]',
  })
  @IsString()
  @IsNotEmpty()
  variants: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Product images',
  })
  @IsOptional()
  images?: any[];
}
