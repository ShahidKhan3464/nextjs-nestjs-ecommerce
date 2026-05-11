import { DataSource } from 'typeorm';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductStatus } from '../constants/product.constants';
import { ProductImage } from '../entities/product-image.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { CreateProductVariantDto } from '../dto/create-product-variant.dto';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CreateProductProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async create(
    dto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    if (!files?.length) {
      throw new BadRequestException('At least one product image is required');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(dto.variants) as unknown;
    } catch {
      throw new BadRequestException('variants must be valid JSON');
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new BadRequestException('At least one variant is required');
    }

    const variantsDto = plainToInstance(
      CreateProductVariantDto,
      parsed as object[],
    );

    for (const v of variantsDto) {
      const errors = validateSync(v);
      if (errors.length) {
        throw new BadRequestException(errors);
      }
    }

    const skus = variantsDto.map((v) => v.sku);
    if (new Set(skus).size !== skus.length) {
      throw new BadRequestException('Duplicate SKU values in payload');
    }

    return await this.dataSource.transaction(async (manager) => {
      const category = await manager.findOne(Category, {
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      for (const v of variantsDto) {
        const skuTaken = await manager.exists(ProductVariant, {
          where: { sku: v.sku },
        });
        if (skuTaken) {
          throw new ConflictException(`SKU "${v.sku}" is already in use`);
        }
      }

      const product = manager.create(Product, {
        name: dto.name,
        ...(dto.description !== undefined &&
        dto.description !== null &&
        String(dto.description).trim() !== ''
          ? { description: dto.description }
          : {}),
        status: dto.status ?? ProductStatus.ACTIVE,
        category,
      });
      await manager.save(product);

      const variantEntities = variantsDto.map((v) =>
        manager.create(ProductVariant, {
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
          product,
        }),
      );
      await manager.save(variantEntities);

      const imageEntities = files.map((file, index) =>
        manager.create(ProductImage, {
          urlPath: `/uploads/products/${file.filename}`,
          sortOrder: index,
          product,
        }),
      );
      await manager.save(imageEntities);

      const createdProduct = await manager.findOne(Product, {
        where: { id: product.id },
        relations: {
          images: true,
          category: true,
          variants: true,
        },
      });

      if (!createdProduct) {
        throw new NotFoundException('Product not found');
      }

      return createdProduct;
    });
  }
}
