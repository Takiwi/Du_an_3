import { Body, Controller, Post } from '@nestjs/common';
import { ApiCommonErrors } from '@packages/api-docs';
import { CreateAnimeDto } from '../dto/requests/createAnime.dto';
import { CreateAnimeUseCase } from '@application/usecase/anime/createAnime.usecase';
import { animeMapper } from '@presentation/mapper/anime.mapper';

@ApiCommonErrors()
@Controller('anime/')
export class AnimeController {
  constructor(private readonly createAnimeUseCase: CreateAnimeUseCase) {}

  @Post('crate')
  async create(@Body() createAnimeDto: CreateAnimeDto) {
    const result = await this.createAnimeUseCase.execute(createAnimeDto);

    if (result.isErr()) throw result.error;

    return animeMapper(result.value);
  }
}
