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

@Module({
  imports: [SharedModule, PassportModule],
  controllers: [AuthController, UserController],
  providers: [
    {
      provide: 'IPasswordHasher',
      useClass: BcryptPasswordHasher,
    },
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    LocalStrategy,
    LoginUseCase,
    RegisterUserUseCase,
  ],
})
export class IdentityModule {}
