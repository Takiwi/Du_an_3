import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { SharedModule } from '../shared/shared.module';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { RegisterUserUseCase } from '@auth/application/useCases/register/register.usecase';
import { LoginUseCase } from '@auth/application/useCases/login/login.usecase';
import { UserController } from './presentation/controllers/user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthentication } from './infrastructure/services/jwt.service';
import { JWT_AUTHENTICATION_TOKEN } from '@auth/application/ports/IJwtAuthentication.port';
import { PASSWORD_HASHER_TOKEN } from '@auth/application/ports/IPasswordHasher.port';
import { USER_REPOSITORY_TOKEN } from '@auth/domain/repositories/IUser.repository';
import { RT_REPOSITORY_TOKEN } from '@auth/domain/repositories/IRefreshToken.repository';
import { RefreshTokenRepository } from './infrastructure/repositories/refreshToken.repository';
import { MeUseCase } from '@auth/application/useCases/me/me.usecase';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { LogoutUseCase } from '@auth/application/useCases/logout/logout.usecase';
import { RefreshTokenUseCase } from '@auth/application/useCases/refreshToken/refreshToken.usecase';
import { DATA_HASHER_TOKEN } from './application/ports/IDataHasher.port';
import { CryptoDataHasher } from './infrastructure/services/cryptoDataHasher.service';
import { FAILED_LOGIN_TRACKER_TOKEN } from './domain/ports/failedLoginTracker.interface';
import { RedisFailedLoginTracker } from './infrastructure/services/redisFailedLoginTracker.service';
import { BLACKLIST_TOKEN } from './application/ports/IBlackList.port';
import { BlacklistToken } from './infrastructure/repositories/blacklistToken.repository';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.getOrThrow<string>('JWT_PRIVATE_KEY'),
        publicKey: configService.getOrThrow<string>('JWT_PUBLIC_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    {
      provide: DATA_HASHER_TOKEN,
      useClass: CryptoDataHasher,
    },
    {
      provide: RT_REPOSITORY_TOKEN,
      useClass: RefreshTokenRepository,
    },
    {
      provide: JWT_AUTHENTICATION_TOKEN,
      useClass: JwtAuthentication,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: FAILED_LOGIN_TRACKER_TOKEN,
      useClass: RedisFailedLoginTracker,
    },
    {
      provide: BLACKLIST_TOKEN,
      useClass: BlacklistToken,
    },
    LocalStrategy,
    JwtStrategy,
    MeUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    RegisterUserUseCase,
  ],
})
export class IdentityModule {}
