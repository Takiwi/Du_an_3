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
import { IMessage, MESSAGE_TOKEN } from '@application/ports/IMessage.port';

@Injectable()
export class CreateAnimeUseCase {
  constructor(
    @Inject(ANIME_REPOSITORY)
    private readonly animeRepository: IAnimeRepository,
    @Inject(TRANSACTION_ROLLBACK_ERROR)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(MESSAGE_TOKEN)
    private readonly message: IMessage,
  ) {}

  async execute(dto: CreateAnimeInput): Promise<Result<Anime, AppError>> {
    const anime = Anime.create(dto);

    if (anime.isErr()) {
      return err(anime.error);
    }

    // check if the anime already exists; if not, add the new anime
    const result = await this.unitOfWork.runInTransaction(async () => {
      return await this.animeRepository.isExistsOrInsert(anime.value);
    });

    if (result.isErr()) return err(result.error);

    this.message.publisher(anime.value, 1);

    return ok(anime.value);
  }
}
