import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { SeedAdminProvider } from './providers/seed-admin.provider.js';
import { SeedCategoriesProvider } from './providers/seed-categories.provider.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Category])],
  providers: [SeedAdminProvider, SeedCategoriesProvider],
})
export class SeedersModule {}
