import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetUsersProvider } from './providers/get-users.provider';
import { BlockUserProvider } from './providers/block-user.provider';
import { CreateUserProvider } from './providers/create-user.provider.js';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    GetUsersProvider,
    BlockUserProvider,
    CreateUserProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
