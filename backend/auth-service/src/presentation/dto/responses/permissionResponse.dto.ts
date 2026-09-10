import { IntersectionType } from '@nestjs/swagger';
import { CreatePermissionDto } from '../requests/createPermission.dto';
import { IdResponseDto } from '../id.dto';

export class PermissionResponseDto extends IntersectionType(
  CreatePermissionDto,
  IdResponseDto,
) {}
