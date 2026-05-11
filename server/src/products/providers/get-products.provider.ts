import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { QueryProductDto } from '../dto/query-product.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductImage } from '../entities/product-image.entity';
import { PaginationProviders } from 'src/common/pagination/providers/pagination.providers';
import { PaginateQueryResult } from 'src/common/pagination/interfaces/paginated.interfaces';

@Injectable()
export class GetProductsProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly paginationProviders: PaginationProviders,
  ) {}

  private buildFilteredProductQb(query: QueryProductDto) {
    const qb = this.productRepository.createQueryBuilder('product');
    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }
    if (query.status) {
      qb.andWhere('product.status = :status', { status: query.status });
    }
    if (query.search?.trim()) {
      qb.andWhere(
        "(product.name ILIKE :search OR COALESCE(product.description, '') ILIKE :search)",
        { search: `%${query.search.trim()}%` },
      );
    }
    return qb;
  }

  public async findAllPaginated(
    query: QueryProductDto,
  ): Promise<PaginateQueryResult<Product>> {
    const { page, limit, skip } = this.paginationProviders.resolvePaging(query);
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';

    const total = await this.buildFilteredProductQb(query).getCount();

    const data = await this.buildFilteredProductQb(query)
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndMapMany(
        'product.images',
        ProductImage,
        'img',
        'img.productId = product.id',
      )
      .orderBy(`product.${sortBy}`, sortOrder)
      .addOrderBy('img.sortOrder', 'ASC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { data, page, limit, total };
  }

  public async findOne(id: number): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndMapMany(
        'product.images',
        ProductImage,
        'img',
        'img.productId = product.id',
      )
      .orderBy('img.sortOrder', 'ASC')
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
