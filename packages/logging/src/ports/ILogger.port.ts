export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export const LOGGER_TOKEN = Symbol("ILogger");
