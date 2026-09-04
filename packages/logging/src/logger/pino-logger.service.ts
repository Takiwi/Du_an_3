import { Injectable } from "@nestjs/common";
import { ILogger } from "../ports/ILogger.port";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class PinoLoggerService implements ILogger {
  constructor(private readonly pino: PinoLogger) {}
  fatal(message: string, context?: Record<string, unknown>): void {
    this.pino.fatal(context ?? {}, message);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.pino.info(context ?? {}, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.pino.warn(context ?? {}, message);
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void {
    this.pino.error({ ...context, err: error }, message);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.pino.debug(context ?? {}, message);
  }
}
