export abstract class AppError extends Error {
  abstract readonly code: string;
  constructor(message: string) {
    super(message);
  }
}
