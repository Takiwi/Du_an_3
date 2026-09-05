import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { USER_PROFILE_REPOSITORY_TOKEN } from './domain/repositories/IUserProfile.repository';
import { UserProfileRepository } from './infrastructure/repositories/userProfile.repository';
import { GetProfileUseCase } from './application/useCases/getProfile/getProfile.usecase';
import { UpdateProfileUseCase } from './application/useCases/updateProfile/updateProfile.usecase';
import { CreateProfileUseCase } from './application/useCases/createProfile/createProfile.usecase';
import { UserController } from './presentation/controllers/user.controller';
import { USER_FACADE_TOKEN } from '@auth/application/ports/IUserFacade.port';
import { UserFacade } from './application/facades/user.facade';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY_TOKEN,
      useClass: UserProfileRepository,
    },
    {
      provide: USER_FACADE_TOKEN,
      useClass: UserFacade,
    },
    GetProfileUseCase,
    UpdateProfileUseCase,
    CreateProfileUseCase,
  ],
  exports: [USER_FACADE_TOKEN, GetProfileUseCase],
})
export class UserModule {}
