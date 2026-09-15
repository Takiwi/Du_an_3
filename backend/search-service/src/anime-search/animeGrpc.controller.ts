import { Controller, ValidationPipe } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';

@Controller()
export class AnimeGrpcController {
  @GrpcMethod('SearchService', 'AnimeSearch')
  async search(@Payload(new ValidationPipe()) q: string) {}
}
