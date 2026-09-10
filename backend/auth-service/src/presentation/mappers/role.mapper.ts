import { Role } from '@domain/entities/authorization/role.entity';
import { RoleResponseDto } from '@presentation/dto/responses/roleResponse.dto';

export class RoleMapper {
  static toResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.getRoleId().toString(),
      name: role.getRoleName(),
      max_members: role.getMax_members(),
    };
  }

  static toArrayResponseDto(roles: Role[]): RoleResponseDto[] {
    return roles.map((role) => {
      return {
        id: role.getRoleId().toString(),
        name: role.getRoleName(),
        max_members: role.getMax_members(),
      };
    });
  }
}
