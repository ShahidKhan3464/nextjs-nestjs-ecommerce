import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductStatus } from '../constants/product.constants';
import { ProductImage } from '../entities/product-image.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CreateProductProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async create(
    dto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    return await this.dataSource.transaction(async (manager) => {
      /**
       * 1. Validate Category (DB rule)
       */
      const category = await manager.findOne(Category, {
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      /**
       * 2. Check SKU uniqueness in DB
       */
      for (const variant of dto.variants) {
        const skuExists = await manager.exists(ProductVariant, {
          where: { sku: variant.sku },
        });

        if (skuExists) {
          throw new ConflictException(`SKU "${variant.sku}" is already in use`);
        }
      }

      /**
       * 3. Create Product
       */
      const product = manager.create(Product, {
        category,
        name: dto.name,
        status: dto.status ?? ProductStatus.ACTIVE,
        description: dto.description?.trim() || null,
        basePrice: Math.min(...dto.variants.map((v) => v.price)),
      });

      await manager.save(product);

      /**
       * 4. Create Variants
       */
      const variantEntities = dto.variants.map((variant) =>
        manager.create(ProductVariant, {
          product,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          price: variant.price,
        }),
      );

      await manager.save(variantEntities);

      /**
       * 5. Create Images
       * (file validation already handled in controller pipe)
       */
      const imageEntities = files.map((file, index) =>
        manager.create(ProductImage, {
          urlPath: `/uploads/products/${file.filename}`,
          sortOrder: index,
          product,
        }),
      );

      await manager.save(imageEntities);

      /**
       * 6. Return full product
       */
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
