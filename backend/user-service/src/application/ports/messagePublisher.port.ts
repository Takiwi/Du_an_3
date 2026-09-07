// Token injection cho NestJS IoC Container
export const MESSAGE_PUBLISHER = Symbol('IMessagePublisher');

export interface IMessagePublisher {
  publish<T>(pattern: string, data: T): Promise<void>;
}
