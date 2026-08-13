export const DomainErrorCode = {
  INVALID_UUID: 'Invalid uuid',
} as const;

export type AppErrorCodeType =
  (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
