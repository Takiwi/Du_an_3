import { Controller, Get } from '@nestjs/common';
import { JwksService } from 'src/identity/infrastructure/services/jwks.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('.well-known')
export class JwksController {
  constructor(private readonly jwksService: JwksService) {}

  @ApiOperation({ summary: 'JWKS - Public keys for JWT verification' })
  @Get('jwks.json')
  getJwks() {
    return this.jwksService.getJwks();
  }
}
