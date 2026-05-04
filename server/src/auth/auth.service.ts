import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { LoggedInUser, LoginProvider } from './providers/login.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly loginProvider: LoginProvider,
    private readonly refreshTokensProvider: RefreshTokensProvider,
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
  ) {}

  public async register(registerDto: CreateUserDto): Promise<{
    user: Pick<User, 'id' | 'fullName' | 'email' | 'role' | 'isBlocked'>;
  }> {
    const user = await this.usersService.createUser(registerDto);
    return {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
        isBlocked: user.isBlocked,
      },
    };
  }

  public async login(loginDto: LoginDto): Promise<{ user: LoggedInUser }> {
    return await this.loginProvider.login(loginDto);
  }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ sent: boolean }> {
    return await this.forgotPasswordProvider.forgotPassword(forgotPasswordDto);
  }

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ reset: true }> {
    return await this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ user: LoggedInUser }> {
    const { accessToken, refreshToken, user } =
      await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
    return {
      user: {
        accessToken,
        refreshToken,
        ...user,
      },
    };
  }
}
