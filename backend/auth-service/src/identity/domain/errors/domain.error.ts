export enum DomainErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
}

// Nhớ sữa lại cho giống application
export abstract class DomainError extends Error {
  abstract readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    public detail?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.detail = detail;
  }
}
