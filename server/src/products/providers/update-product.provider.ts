import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';
import { GetProductsProvider } from './get-products.provider';
import { ProductImage } from '../entities/product-image.entity';
import { DeleteProductProvider } from './delete-product.provider';
import { Category } from 'src/categories/entities/category.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UpdateProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @Inject(forwardRef(() => GetProductsProvider))
    private readonly getProductsProvider: GetProductsProvider,
    private readonly deleteProductProvider: DeleteProductProvider,
  ) {}

  public async update(
    id: number,
    dto: UpdateProductDto,
    files: Express.Multer.File[] = [],
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.status !== undefined) product.status = dto.status;
    if (dto.variants !== undefined) {
      await this.productVariantRepository.delete({ product: { id } });
      product.variants = dto.variants.map((v) =>
        this.productVariantRepository.create({ ...v, product }),
      );
      product.basePrice = Math.min(...dto.variants.map((v) => v.price));
    }

    await this.productRepository.save(product);

    if (dto.retainImagePaths !== undefined) {
      const keep = dto.retainImagePaths;
      const imagesToRemove = await this.productImageRepository.find({
        where:
          keep.length === 0
            ? { product: { id } }
            : { product: { id }, urlPath: Not(In(keep)) },
      });
      await Promise.all(
        imagesToRemove.map((img) =>
          this.deleteProductProvider.safeUnlinkPublicPath(img.urlPath),
        ),
      );
      if (keep.length === 0) {
        await this.productImageRepository.delete({ product: { id } });
      } else {
        await this.productImageRepository.delete({
          product: { id },
          urlPath: Not(In(keep)),
        });
      }
    }

    if (files.length > 0) {
      const existing = await this.productImageRepository.find({
        where: { product: { id } },
        order: { sortOrder: 'ASC' },
      });
      const nextOrder =
        existing.length > 0
          ? Math.max(...existing.map((img) => img.sortOrder)) + 1
          : 0;

      const imageEntities = files.map((file, index) =>
        this.productImageRepository.create({
          urlPath: `/uploads/products/${file.filename}`,
          sortOrder: nextOrder + index,
          product: { id } as Product,
        }),
      );
      await this.productImageRepository.save(imageEntities);
    }

    return await this.getProductsProvider.findOne(id);
  }
}
