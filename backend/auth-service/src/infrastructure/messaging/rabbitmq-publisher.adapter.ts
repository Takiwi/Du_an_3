import { IMessagePublisher } from '@application/ports/IMessagePublisher.port';
import { IMessageRequester } from '@application/ports/IMessageRequester.port';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQPublisherAdaptor
  implements IMessagePublisher, IMessageRequester
{
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  async request<TOutput>(pattern: string, data: unknown): Promise<TOutput> {
    return await lastValueFrom(this.client.send<TOutput>(pattern, data));
  }

  async publish<T>(pattern: string, data: T): Promise<void> {
    return await lastValueFrom(this.client.send(pattern, data));
  }
}
