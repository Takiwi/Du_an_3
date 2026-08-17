import { IDataHasher } from '@auth/application/ports/IDataHasher.port';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoDataHasher implements IDataHasher {
  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  compare(plainData: string, hashedData: string): boolean {
    const bufferPlainData = Buffer.from(plainData, 'utf8');
    const bufferHashedData = Buffer.from(hashedData, 'utf8');

    if (bufferHashedData.length !== bufferPlainData.length) return false;

    return crypto.timingSafeEqual(bufferPlainData, bufferHashedData);
  }
}
