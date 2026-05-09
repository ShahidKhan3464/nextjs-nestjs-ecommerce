import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Min,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Min(1)
  productId: number;

  @ApiProperty({
    example: 'XL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  size?: string;

  @ApiProperty({
    example: 'Red',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  color?: string;

  @ApiProperty({
    example: 'NK-RD-XL',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  sku: string;

  @ApiProperty({
    example: 20,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 150,
  })
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  price: number;
}
