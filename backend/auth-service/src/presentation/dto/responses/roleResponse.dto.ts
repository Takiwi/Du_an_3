import { IntersectionType } from '@nestjs/swagger';
import { IdResponseDto } from '@packages/api-docs';
import { CreateRoleDto } from '../requests/createRole.dto';

export class RoleResponseDto extends IntersectionType(
  CreateRoleDto,
  IdResponseDto,
) {}
