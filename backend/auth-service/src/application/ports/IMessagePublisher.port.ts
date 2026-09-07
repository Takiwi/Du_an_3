export const MESSAGE_PUBLISHER_TOKEN = 'IMessagePublisher';

export interface IMessagePublisher {
  publish<T>(pattern: string, data: T): Promise<void>;
}
