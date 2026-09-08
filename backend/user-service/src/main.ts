import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PACKAGES, PROTO_PATHS } from '@packages/grpc-contracts';
import { Logger } from 'nestjs-pino';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationFieldException } from './presentation/errors/validationField.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  // router
  app.setGlobalPrefix('/api/v1');

  // gRPC Microservice (PORT 5002)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PROTO_PACKAGES.USER,
      protoPath: PROTO_PATHS.USER,
      url: 'localhost:5002',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (error: ValidationError[]) => {
        const formatted = error.map((err) => ({
          field: err.property,
          constraints: Object.values(err.constraints ?? {}),
        }));

        return new ValidationFieldException('Validation false', formatted);
      },
    }),
  );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
