import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { SharedModule } from '../shared/shared.module';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/prismaUser.repository';
import { RegisterUserUseCase } from './application/useCases/registerUser';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [SharedModule],
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
    RegisterUserUseCase,
  ],
})
export class IdentityModule {}
