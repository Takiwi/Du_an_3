import { MESSAGE_PUBLISHER } from '@application/ports/messagePublisher.port';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQPublisherAdaptor } from 'src/infrastructure/messaging/rabbitmq-publisher.adapter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: MESSAGE_PUBLISHER,
      useClass: RabbitMQPublisherAdaptor,
    },
  ],
  exports: [MESSAGE_PUBLISHER],
})
export class RabbitMQModule {}
