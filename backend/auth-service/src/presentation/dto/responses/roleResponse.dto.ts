import { IntersectionType } from '@nestjs/swagger';
import { IdResponseDto } from '../id.dto';
import { CreateRoleDto } from '../requests/createRole.dto';

export class RoleResponseDto extends IntersectionType(
  CreateRoleDto,
  IdResponseDto,
) {}
