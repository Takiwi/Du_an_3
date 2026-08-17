import { Injectable } from "@nestjs/common";
import { ILogger } from "@packages/core/logging/ILogger.post";

@Injectable()
export class PinoLoggerService implements ILogger {
  info(message: string, context?: Record<string, unknown>): void {
    throw new Error("Method not implemented.");
  }
  warn(message: string, context?: Record<string, unknown>): void {
    throw new Error("Method not implemented.");
  }
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void {
    throw new Error("Method not implemented.");
  }
  debug(message: string, context?: Record<string, unknown>): void {
    throw new Error("Method not implemented.");
  }
}
