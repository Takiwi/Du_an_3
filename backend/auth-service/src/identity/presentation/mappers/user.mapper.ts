import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/responses/userResponse.dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }
}
