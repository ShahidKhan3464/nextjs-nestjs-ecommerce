import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';
import { GetProductsProvider } from './get-products.provider';
import { Category } from 'src/categories/entities/category.entity';
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
    @Inject(forwardRef(() => GetProductsProvider))
    private readonly getProductsProvider: GetProductsProvider,
  ) {}

  public async update(id: number, dto: UpdateProductDto): Promise<Product> {
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

    await this.productRepository.save(product);
    return await this.getProductsProvider.findOne(id);
  }
}
