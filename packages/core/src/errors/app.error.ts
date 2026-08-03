export abstract class AppError extends Error {
  abstract readonly code: string;
  public readonly details?: Record<string, unknown>[];

  constructor(message: string, details?: Record<string, unknown>[]) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }
}
