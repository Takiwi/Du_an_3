import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { SharedModule } from '../shared/shared.module';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { RegisterUserUseCase } from './application/useCases/registerUser.usecase';
import { UserController } from './presentation/controllers/user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/auth/local.strategy';
import { LoginUseCase } from './application/useCases/login.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthentication } from './infrastructure/services/jwt.auth';
import { JWT_AUTHENTICATION_TOKEN } from './application/ports/IJwtAuthentication.port';
import { PASSWORD_HASHER_TOKEN } from './application/ports/IPasswordHasher.port';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/IUser.repository';
import { RT_REPOSITORY_TOKEN } from './domain/repositories/IRefreshToken.repository';
import { RefreshTokenRepository } from './infrastructure/persistence/repositories/refreshToken.repository';
import { MeUseCase } from './application/useCases/me.usecase';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { LogoutUseCase } from './application/useCases/logout.usecase';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        publicKey: configService.get<string>('JWT_PUBLIC_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
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
    LocalStrategy,
    JwtStrategy,
    MeUseCase,
    LoginUseCase,
    LogoutUseCase,
    RegisterUserUseCase,
  ],
})
export class IdentityModule {}
