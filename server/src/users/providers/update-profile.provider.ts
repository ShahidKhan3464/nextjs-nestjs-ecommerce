import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdateProfileProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async update(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName.trim();
    }
    if (dto.phoneNumber !== undefined) {
      user.phoneNumber = dto.phoneNumber.trim();
    }

    return this.userRepository.save(user);
  }
}
