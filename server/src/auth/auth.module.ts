import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { LoginProvider } from './providers/login.provider';
import { BcryptProvider } from './providers/bycrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';

@Module({
  providers: [
    AuthService,
    LoginProvider,
    RefreshTokensProvider,
    GenerateTokensProvider,
    { provide: HashingProvider, useClass: BcryptProvider },
  ],
  exports: [HashingProvider],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class AuthModule {}
