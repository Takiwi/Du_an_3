import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exportJWK, importSPKI, JWK } from 'jose';

@Injectable()
export class JwksService implements OnModuleInit {
  private jwk!: JWK;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const publicKeyPem = this.configService.getOrThrow<string>('jwt.publicKey');
    const publicKey = await importSPKI(publicKeyPem, 'RS256');
    const rawJwk = await exportJWK(publicKey);

    this.jwk = {
      ...rawJwk,
      kid: this.configService.getOrThrow<string>('JWK_KID'),
      use: 'sig',
      alg: 'RS256',
    };
  }

  getJwks() {
    return { keys: [this.jwk] };
  }
}
