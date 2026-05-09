// import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  // Max,
  Min,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'Category ID',
  })
  @IsNumber()
  @Min(1)
  categoryId: number;

  @ApiProperty({
    example: 'Nike Shoes',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Premium running shoes',
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  // @ApiProperty({
  //   example: 100,
  // })
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // @Max(1000000)
  // basePrice: number;
}
