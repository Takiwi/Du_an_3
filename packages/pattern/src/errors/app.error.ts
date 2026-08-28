export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly internalMessage: string,
    // public readonly cause?: unknown,
  ) {
    super(internalMessage);
  }
}
