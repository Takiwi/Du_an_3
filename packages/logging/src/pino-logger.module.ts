import { DynamicModule, Module } from "@nestjs/common";
import { randomUUID } from "crypto";
import { LoggerModule as NestjsPinoModule } from "nestjs-pino";
import { LOGGER_TOKEN } from "@packages/core/logging/ILogger.post";
import { PinoLoggerService } from "./pino-logger.service.js";
import { ConfigService } from "@nestjs/config";

@Module({})
export class AppLoggerModule {
  static forRoot(serviceName: string): DynamicModule {
    return {
      module: AppLoggerModule,
      global: true,
      imports: [
        NestjsPinoModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const nodeEnv = configService.get<string>("NODE_ENV");
            const isProd = nodeEnv === "production";

            return {
              pinoHttp: {
                name: serviceName,
                level: isProd ? "info" : "debug",
                transport: !isProd
                  ? {
                      target: "pino-pretty",
                      options: {
                        singleLine: true,
                        colorize: true,
                        translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
                        ignore: "pid,hostname",
                      },
                    }
                  : undefined,
                genReqId: (req) => req.headers["x-request-id"] ?? randomUUID(),
                redact: [
                  "req.headers.authorization",
                  "req.headers.cookie",
                  "*.password",
                  "*.refreshToken",
                ],
              },
            };
          },
        }),
      ],
      providers: [{ provide: LOGGER_TOKEN, useClass: PinoLoggerService }],
      exports: [LOGGER_TOKEN],
    };
  }
}
