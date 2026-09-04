export const InfrastructureErrorCode = {
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  NOT_FOUND_RELATED_RECORD: 'NOT_FOUND_RELATED_RECORD',
} as const;

export type AppErrorCodeType =
  (typeof InfrastructureErrorCode)[keyof typeof InfrastructureErrorCode];
