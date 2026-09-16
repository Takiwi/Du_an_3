import { IntersectionType } from '@nestjs/swagger';
import { CreatePermissionDto } from '../requests/createPermission.dto';
import { IdResponseDto } from '@packages/api-docs';

export class PermissionResponseDto extends IntersectionType(
  CreatePermissionDto,
  IdResponseDto,
) {}
