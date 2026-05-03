import { Module } from '@nestjs/common';
import { PaginationProviders } from './providers/pagination.providers';

@Module({
  exports: [PaginationProviders],
  providers: [PaginationProviders],
})
export class PaginationModule {}
