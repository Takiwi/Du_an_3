import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwksController } from './presentation/controllers/jwks.controller';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from '@user/user.module';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher.service';
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { RegisterUseCase } from './application/useCases/register/register.usecase';
import { LoginUseCase } from './application/useCases/login/login.usecase';
import { LogoutUseCase } from './application/useCases/logout/logout.usecase';
import { RefreshTokenUseCase } from './application/useCases/refreshToken/refreshToken.usecase';
import { ChangePasswordUseCase } from './application/useCases/changePassword/changePassword.usecase';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthentication } from './infrastructure/services/jwt.service';
import { JWT_AUTHENTICATION_TOKEN } from './application/ports/IJwtAuthentication.port';
import { PASSWORD_HASHER_TOKEN } from './application/ports/IPasswordHasher.port';
import { ACCOUNT_REPOSITORY_TOKEN } from './domain/repositories/IAccount.repository';
import { RT_REPOSITORY_TOKEN } from './domain/repositories/IRefreshToken.repository';
import { RefreshTokenRepository } from './infrastructure/repositories/refreshToken.repository';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { DATA_HASHER_TOKEN } from './application/ports/IDataHasher.port';
import { CryptoDataHasher } from './infrastructure/services/cryptoDataHasher.service';
import { FAILED_LOGIN_TRACKER_TOKEN } from './domain/ports/failedLoginTracker.interface';
import { RedisFailedLoginTracker } from './infrastructure/services/redisFailedLoginTracker.service';
import { BLACKLIST_TOKEN } from './application/ports/IBlackList.port';
import { BlacklistTokenRepository } from './infrastructure/repositories/blacklistToken.repository';
import { JwksService } from './infrastructure/services/jwks.service';

@Module({
  imports: [
    SharedModule,
    UserModule,
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
  controllers: [AuthController, JwksController],
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
      provide: ACCOUNT_REPOSITORY_TOKEN,
      useClass: AccountRepository,
    },
    {
      provide: FAILED_LOGIN_TRACKER_TOKEN,
      useClass: RedisFailedLoginTracker,
    },
    {
      provide: BLACKLIST_TOKEN,
      useClass: BlacklistTokenRepository,
    },
    JwksService,
    JwtStrategy,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    RegisterUseCase,
    ChangePasswordUseCase,
  ],
  exports: [JWT_AUTHENTICATION_TOKEN, PassportModule, JwtModule],
})
export class AuthModule {}
