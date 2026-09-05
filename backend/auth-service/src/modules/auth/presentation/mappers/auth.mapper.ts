import { Account } from '../../domain/entities/account/account.entity';
import { AuthResponseDto } from '../dto/responses/authResponse.dto';

export class AuthMapper {
  static toResponseDto(account: Account, username?: string): AuthResponseDto {
    return {
      id: account.getId().toString(),
      email: account.getEmail(),
      username: username,
      status: account.getStatus().currentStatus(),
      role: account.getRole(),
    };
  }
}
