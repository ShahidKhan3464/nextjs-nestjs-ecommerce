import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { PaginateQueryResult } from '../interfaces/paginated.interfaces';

@Injectable()
export class PaginationProviders {
  public async paginateQuery<T extends ObjectLiteral>(
    query: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<PaginateQueryResult<T>> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    const total = await repository.count();
    const data = await repository.find({
      skip,
      take: limit,
    });
    return {
      data,
      page,
      limit,
      total,
    };
  }
}
