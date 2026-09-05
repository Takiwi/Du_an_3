import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsModule, RequestIdMiddleware } from '@packages/request-context';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthExceptionFilter } from '@presentation/filters/authExceptions.filter';
import { AppLoggerModule } from '@packages/logging';
import appConfig from './config/app.config';
import prismaDatabaseConfig from './config/prismaDatabase.config';
import redisDatabaseConfig from './config/redisDatabase.config';
import jwtConfig from './config/jwt.config';
import cookieConfig from './config/cookie.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwksController } from './presentation/controllers/jwks.controller';
import { DATA_HASHER_TOKEN } from './application/ports/IDataHasher.port';
import { CryptoDataHasher } from './infrastructure/services/cryptoDataHasher.service';
import { RT_REPOSITORY_TOKEN } from './domain/repositories/IRefreshToken.repository';
import { RefreshTokenRepository } from './infrastructure/repositories/refreshToken.repository';
import { JWT_AUTHENTICATION_TOKEN } from './application/ports/IJwtAuthentication.port';
import { JwtAuthentication } from './infrastructure/services/jwt.service';
import { PASSWORD_HASHER_TOKEN } from './application/ports/IPasswordHasher.port';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher.service';
import { ACCOUNT_REPOSITORY_TOKEN } from './domain/repositories/IAccount.repository';
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { FAILED_LOGIN_TRACKER_TOKEN } from './domain/ports/failedLoginTracker.interface';
import { RedisFailedLoginTracker } from './infrastructure/services/redisFailedLoginTracker.service';
import { BLACKLIST_TOKEN } from './application/ports/IBlackList.port';
import { BlacklistTokenRepository } from './infrastructure/repositories/blacklistToken.repository';
import { JwksService } from './infrastructure/services/jwks.service';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { LoginUseCase } from './application/useCases/login/login.usecase';
import { LogoutUseCase } from './application/useCases/logout/logout.usecase';
import { RefreshTokenUseCase } from './application/useCases/refreshToken/refreshToken.usecase';
import { RegisterUseCase } from './application/useCases/register/register.usecase';
import { ChangePasswordUseCase } from './application/useCases/changePassword/changePassword.usecase';
import { FormatResponse } from '@presentation/interceptors/formatResponse.interceptor';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { RedisService } from '@infrastructure/database/redis.service';
import { UserProfileService } from '@infrastructure/services/userProfile.service';
@Module({
  imports: [
    ClsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        prismaDatabaseConfig,
        redisDatabaseConfig,
        jwtConfig,
        cookieConfig,
      ],
    }),
    AppLoggerModule.forRoot('auth-service'),
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
      provide: 'IUserFacade',
      useClass: UserProfileService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponse,
    },
    {
      provide: APP_FILTER,
      useClass: ClsModule,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
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
    PrismaService,
    RedisService,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
