import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationFieldException } from './identity/presentation/errors/validationField.error';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(cookieParser());
  app.enableShutdownHooks();

  // router
  app.setGlobalPrefix('/api/v1');

  // Cấu hình tài liệu OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Auth service API')
    .setDescription('Tài liệu api cho auth service')
    .setVersion('1.0')
    .build();

  // Tạo document
  const document = SwaggerModule.createDocument(app, config);

  // Khởi tạo đường dẫn Swagger UI
  SwaggerModule.setup('api', app, document);

  // pipes
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
