import { Controller, Get } from '@nestjs/common';
import { JwksService } from '../../infrastructure/services/jwks.service';
import { ApiOperation } from '@nestjs/swagger';
import { SkipResponseTransform } from '@presentation/decorators/skipResponseFormat';

@Controller('.well-known')
export class JwksController {
  constructor(private readonly jwksService: JwksService) {}

  @ApiOperation({ summary: 'JWKS - Public keys for JWT verification' })
  @SkipResponseTransform()
  @Get('jwks.json')
  getJwks() {
    return this.jwksService.getJwks();
  }
}
