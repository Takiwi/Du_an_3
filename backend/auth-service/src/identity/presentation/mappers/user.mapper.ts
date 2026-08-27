import { User } from '@auth/domain/entities/user.entity';
import { UserResponseDto } from '../dto/responses/userResponse.dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.getId.toString(),
      email: user.getEmail(),
      username: user.getUsername(),
      status: user.getStatus().currentStatus(),
      role: user.getRole(),
    };
  }
}
