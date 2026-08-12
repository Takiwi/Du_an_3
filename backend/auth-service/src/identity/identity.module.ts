import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { SharedModule } from '../shared/shared.module';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/prismaUser.repository';
import { RegisterUserUseCase } from './application/useCases/registerUser.usecase';
import { UserController } from './presentation/controllers/user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './infrastructure/auth/local.strategy';
import { LoginUseCase } from './application/useCases/login.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthentication } from './infrastructure/auth/jwt.auth';
import { JWT_AUTHENTICATION_TOKEN } from './application/ports/IJwtAuthentication.port';
import { PASSWORD_HASHER_TOKEN } from './application/ports/IPasswordHasher.port';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/IUser.repository';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // expiresIn accepts string or number; cast to any to satisfy types
          expiresIn: configService.get<number>('JWT_EXPIRES_IN') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
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
      useClass: PrismaUserRepository,
    },
    LocalStrategy,
    LoginUseCase,
    RegisterUserUseCase,
  ],
})
export class IdentityModule {}
