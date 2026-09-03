import { Body, Controller, Post } from '@nestjs/common';
import { ApiCommonErrors } from '@packages/api-docs';
import { CreateAnimeDto } from '../dto/requests/createAnime.dto';

@ApiCommonErrors()
@Controller('anime/')
export class AnimeController {
  @Post('crate')
  create(@Body() createAnimeDto: CreateAnimeDto) {}
}
