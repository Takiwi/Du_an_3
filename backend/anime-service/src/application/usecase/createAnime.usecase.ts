import { Injectable } from '@nestjs/common';
import { CreateAnimeInput } from './createAnime.contract';
import { Anime } from '@auth/domain/entities/anime/anime.entity';

@Injectable()
export class CreateAnimeUseCase {
  async execute(dto: CreateAnimeInput) {
    const anime = Anime.create(dto);
  }
}
