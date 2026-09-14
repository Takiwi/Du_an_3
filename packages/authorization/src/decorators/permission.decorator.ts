import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEYS = 'Permissions';
export const Permission = (...permission: string[]) =>
  SetMetadata(PERMISSION_KEYS, permission);
