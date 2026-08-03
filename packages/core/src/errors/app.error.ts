export abstract class AppError extends Error {
  abstract readonly code: string;
  // public readonly details?: Record<string, unknown>[];

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
