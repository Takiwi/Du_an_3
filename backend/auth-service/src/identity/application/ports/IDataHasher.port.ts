export const DATA_HASHER_TOKEN = 'IDataHasher';

export interface IDataHasher {
  hash(data: string): string;
  compare(plainData: string, hashedData: string): boolean;
}
