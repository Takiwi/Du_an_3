import { Injectable } from '@nestjs/common';
import { CreateAnimeInput } from './createAnime.contract';
import { Anime } from '@domain/entities/anime/anime.entity';
import { Result } from 'neverthrow';
import { AppError } from '@packages/pattern';

@Injectable()
export class CreateAnimeUseCase {
  async execute(dto: CreateAnimeInput): Promise<Result<Anime, AppError>> {
    const anime = Anime.create(dto);

    if (anime.isErr()) return anime;
  }
}
