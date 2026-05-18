import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { QueryProductDto } from '../dto/query-product.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (query.lifeCycle === 'all' || query.lifeCycle === 'removed') {
      qb.withDeleted();
    }

    if (query.lifeCycle === 'removed') {
      qb.andWhere('product.deletedAt IS NOT NULL');
    }

    if (query.categoryId) {
      // Use join to ensure categoryId filtering works reliably regardless of virtual column naming
      qb.innerJoin(
        'product.category',
        'cat_filter',
        'cat_filter.id = :categoryId',
        {
          categoryId: query.categoryId,
        },
      );
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

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      qb.innerJoin('product.variants', 'price_filter');

      if (query.minPrice !== undefined && query.minPrice !== null) {
        qb.andWhere('price_filter.price >= :minPrice', {
          minPrice: query.minPrice,
        });
      }

      if (query.maxPrice !== undefined && query.maxPrice !== null) {
        qb.andWhere('price_filter.price <= :maxPrice', {
          maxPrice: query.maxPrice,
        });
      }
    }

    if (query.minRating !== undefined && query.minRating !== null) {
      qb.andWhere('product.rating >= :minRating', {
        minRating: query.minRating,
      });
    }

    return qb;
  }

  public async findAllPaginated(
    query: QueryProductDto,
  ): Promise<PaginateQueryResult<Product>> {
    const { page, limit, skip } = this.paginationProviders.resolvePaging(query);

    const total = await this.buildFilteredProductQb(query).getCount();

    const data = await this.buildFilteredProductQb(query)
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('product.createdAt', 'DESC')
      .addOrderBy('images.sortOrder', 'ASC')
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
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('images.sortOrder', 'ASC')
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  public async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.slug = :slug', { slug })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.images', 'img')
      .orderBy('img.sortOrder', 'ASC')
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
