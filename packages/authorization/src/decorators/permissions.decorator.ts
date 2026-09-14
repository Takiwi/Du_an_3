import { SetMetadata } from "@nestjs/common";

export const PERMISSION_KEYS = "Permissions";
export const Permissions = (...permission: string[]) =>
  SetMetadata(PERMISSION_KEYS, permission);
