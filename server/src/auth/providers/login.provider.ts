import { LoginDto } from '../dto/login.dto';
import { HashingProvider } from './hashing.provider';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import {
  Injectable,
  UnauthorizedException,
  RequestTimeoutException,
} from '@nestjs/common';

export type LoggedInUser = Pick<User, 'id' | 'fullName' | 'email'> & {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class LoginProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async login(loginDto: LoginDto): Promise<{ user: LoggedInUser }> {
    const user = await this.usersService
      .findOneByEmail(loginDto.email)
      .catch(() => {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment',
          { description: 'Error connecting to the database' },
        );
      });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingProvider.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const {
      accessToken,
      refreshToken,
      user: loggedInUser,
    } = await this.generateTokensProvider.generateTokens(user);
    return {
      user: {
        accessToken,
        refreshToken,
        ...loggedInUser,
      },
    };
  }
}
