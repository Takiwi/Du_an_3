import { Module } from '@nestjs/common';
import { IdentityController } from './presentation/controllers/identity.controller';
import { RegisterUserUseCase } from './application/useCases/registerUser';
import { userRepository } from './infrastructure/persistence/repositories/user.repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [IdentityController],
  providers: [
    RegisterUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: userRepository,
    },
  ],
})
export class IdentityModule {}
