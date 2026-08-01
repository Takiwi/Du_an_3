import { Module } from '@nestjs/common';
import { IdentityController } from './presentation/controllers/identity.controller';
import { SharedModule } from '../shared/shared.module';
import { BcryptPasswordHasher } from './infrastructure/services/bcryptPasswordHasher';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/prismaUser.repository';
import { RegisterUserUseCase } from './application/useCases/registerUser';

@Module({
  imports: [SharedModule],
  controllers: [IdentityController],
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
