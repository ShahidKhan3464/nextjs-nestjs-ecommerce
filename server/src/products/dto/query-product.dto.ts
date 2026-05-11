import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '../constants/product.constants';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import {
  Min,
  IsIn,
  IsInt,
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class QueryProductDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Search in product name and description (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'name'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name'])
  sortBy?: 'createdAt' | 'updatedAt' | 'name' = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
