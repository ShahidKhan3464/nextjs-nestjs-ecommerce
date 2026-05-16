import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlockUserProvider } from './providers/block-user.provider';
import { CreateUserProvider } from './providers/create-user.provider.js';
import { PaginateQueryResult } from 'src/common/pagination/interfaces/paginated.interfaces';
import {
  FindUsersQuery,
  GetUsersProvider,
} from './providers/get-users.provider';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly getUsersProvider: GetUsersProvider,
    private readonly blockUserProvider: BlockUserProvider,
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async findAllPaginated(
    query: FindUsersQuery,
  ): Promise<PaginateQueryResult<User>> {
    return await this.getUsersProvider.findAllPaginated(query);
  }

  public async findOne(id: number): Promise<User> {
    return await this.getUsersProvider.findOne(id);
  }

  public async blockUser(id: number, isBlocked: boolean): Promise<User> {
    return await this.blockUserProvider.blockUser(id, isBlocked);
  }

  public async createUser(dto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.createUser(dto);
  }

  public async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async updatePassword(
    id: number,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    const result = await this.userRepository.update(
      { id },
      { password, confirmPassword },
    );
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }
}
