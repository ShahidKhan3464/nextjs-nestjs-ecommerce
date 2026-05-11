import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesProvider } from './providers/get-categories.provider';
import { CreateCategoryProvider } from './providers/create-category.provider';
import { PaginateQueryResult } from 'src/common/pagination/interfaces/paginated.interfaces';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly getCategoriesProvider: GetCategoriesProvider,
    private readonly createCategoryProvider: CreateCategoryProvider,
  ) {}

  public async findAllPaginated(
    query: QueryCategoryDto,
  ): Promise<PaginateQueryResult<Category>> {
    return await this.getCategoriesProvider.findAllPaginated(query);
  }

  public async findOne(id: number): Promise<Category> {
    return await this.getCategoriesProvider.findOne(id);
  }

  public async create(dto: CreateCategoryDto): Promise<Category> {
    return await this.createCategoryProvider.create(dto);
  }
}
