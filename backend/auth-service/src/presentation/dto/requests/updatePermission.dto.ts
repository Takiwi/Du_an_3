import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './createPermission.dto';
import { UpdatePermissionProps } from '@domain/entities/authorization/permission.contract';

export class UpdatePermissionDto
  extends PartialType(CreatePermissionDto)
  implements UpdatePermissionProps {}
