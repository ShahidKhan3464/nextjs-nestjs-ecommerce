import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
// import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import {
  Inject,
  forwardRef,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CreateUserProvider {
  constructor(
    // private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hash(createUserDto.password),
      confirmPassword: await this.hashingProvider.hash(
        createUserDto.confirmPassword,
      ),
    });

    // await this.mailService.sendWelcomeEmail(newUser.email, newUser.fullName);

    return await this.userRepository.save(newUser);
  }
}
