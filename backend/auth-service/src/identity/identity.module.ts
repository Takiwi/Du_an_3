import { Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { IdentityController } from './presentation/controllers/identity.controller';
import { RegisterUserUseCase } from './application/useCases/registerUser';
import { userRepository } from './infrastructure/persistence/repositories/user.repository';

@Module({
  imports: [AppModule],
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
