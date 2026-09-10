import { Permission } from '@domain/entities/authorization/permission.entity';
import { PermissionResponseDto } from '@presentation/dto/responses/permissionResponse.dto';

export class PermissionMapper {
  static toResponseDto(permission: Permission): PermissionResponseDto {
    return {
      id: permission.getId().toString(),
      action: permission.getAction(),
      resource: permission.getResource(),
    };
  }

  static toArrayResponseDto(
    permissions: Permission[],
  ): PermissionResponseDto[] {
    return permissions.map((pr) => {
      return {
        id: pr.getId().toString(),
        action: pr.getAction(),
        resource: pr.getResource(),
      };
    });
  }
}
