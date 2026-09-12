import { AuthResponseDto } from '../dto/responses/authResponse.dto';

export class AuthMapper {
  static toResponseDto(props: {
    id: string;
    username?: string;
    email?: string;
    role?: string[];
    status?: string;
  }): AuthResponseDto {
    return {
      id: props.id,
      email: props.email,
      username: props.username,
      status: props.status,
      role: props.role,
    };
  }
}
