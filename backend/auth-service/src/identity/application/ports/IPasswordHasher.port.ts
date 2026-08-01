export const PASSWORD_HASHER_TOKEN = 'IPasswordHasher';

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
