import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'Anime queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // rabbitMQ
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
