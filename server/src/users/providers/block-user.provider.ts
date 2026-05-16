import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersProvider } from './get-users.provider';

@Injectable()
export class BlockUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly getUsersProvider: GetUsersProvider,
  ) {}

  public async blockUser(id: number, isBlocked: boolean): Promise<User> {
    const user = await this.getUsersProvider.findOne(id);
    user.isBlocked = isBlocked;
    return await this.userRepository.save(user);
  }
}
