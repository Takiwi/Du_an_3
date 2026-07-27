import { AUTH_ERROR_CODES } from "../constants/authErrorCode.js";

export class AppError extends Error {
  constructor(
    public readonly code: keyof typeof AUTH_ERROR_CODES,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message);
  }
}
