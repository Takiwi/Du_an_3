export const MESSAGE_REQUESTER_TOKEN = 'IMessageRequester';

export interface IMessageRequester {
  request<TOutput>(pattern: string, data: unknown): Promise<TOutput>;
}
