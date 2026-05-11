import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { GetCategoriesProvider } from './providers/get-categories.provider';
import { CreateCategoryProvider } from './providers/create-category.provider';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, GetCategoriesProvider, CreateCategoryProvider],
})
export class CategoriesModule {}
