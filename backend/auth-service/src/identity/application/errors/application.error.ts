export const ApplicationErrorCode = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  PASSWORD_DO_NOT_MATCH: 'PASSWORD_DO_NOT_MATCH',
} as const;

export type AppErrorCodeType =
  (typeof ApplicationErrorCode)[keyof typeof ApplicationErrorCode];
