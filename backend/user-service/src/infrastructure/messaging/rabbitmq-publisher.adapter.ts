import { IMessagePublisher } from '@application/ports/messagePublisher.port';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQPublisherAdaptor implements IMessagePublisher {
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  async publish<T>(pattern: string, data: T): Promise<void> {
    return await lastValueFrom(this.client.emit(pattern, data));
  }
}
