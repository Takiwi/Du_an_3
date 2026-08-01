import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/ports/IPasswordHasher.port';

export class BcryptPasswordHasher implements IPasswordHasher {
  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  async hash(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10);
  }
}
