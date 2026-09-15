import { Controller, Get, Query } from '@nestjs/common';
import { AnimeSearchService } from './anime-search.service';

@Controller('anime')
export class AnimeSearchController {
  constructor(private readonly animeSearchService: AnimeSearchService) {}

  @Get('search')
  async search(@Query('q') q: string) {
    return this.animeSearchService.searchAnime(q);
  }
}
