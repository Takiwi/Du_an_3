import { UserProfile } from '../../domain/entities/userProfile.entity';
import { UserProfileResponseDto } from '../dto/responses/userProfileResponse.dto';

export class UserProfileMapper {
  static toResponseDto(profile: UserProfile): UserProfileResponseDto {
    return {
      id: profile.getId().toString(),
      email: profile.getEmail(),
      username: profile.getUsername().toString(),
      status: profile.getStatus(),
      role: profile.getRole(),
    };
  }
}
