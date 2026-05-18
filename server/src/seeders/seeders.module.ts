import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { SeedAdminProvider } from './providers/seed-admin.provider.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  providers: [SeedAdminProvider],
})
export class SeedersModule {}
