import { Inject, Injectable } from '@nestjs/common';
import { CreateAnimeInput } from './createAnime.contract';
import { Anime } from '@domain/entities/anime/anime.entity';
import { err, ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';
import {
  ANIME_REPOSITORY,
  IAnimeRepository,
} from '@domain/repositories/IAnime.repository';
import {
  IUnitOfWork,
  TRANSACTION_ROLLBACK_ERROR,
} from '@application/ports/IUnitOfWork.port';

@Injectable()
export class CreateAnimeUseCase {
  constructor(
    @Inject(ANIME_REPOSITORY)
    private readonly animeRepository: IAnimeRepository,
    @Inject(TRANSACTION_ROLLBACK_ERROR)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(dto: CreateAnimeInput): Promise<Result<Anime, AppError>> {
    const anime = Anime.create(dto);

    if (anime.isErr()) return anime;

    // 1. check if anime exists, if no add it
    const result = await this.unitOfWork.runInTransaction(async () => {
      return await this.animeRepository.isExistsOrInsert(
        dto.title,
        dto.releaseDate,
      );
    });

    if (result.isErr()) return err(result.error);

    return ok(anime.value);
  }
}
