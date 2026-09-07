import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PACKAGES, PROTO_PATHS } from '@packages/grpc-contracts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // gRPC Microservice (PORT 5001)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PROTO_PACKAGES.USER,
      protoPath: PROTO_PATHS.USER,
      url: '0.0.0.0:5001',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
