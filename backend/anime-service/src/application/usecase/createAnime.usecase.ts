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
import { AnimeRelation } from '@domain/entities/animeRelation/animeRelation.entity';
import { AnimeId } from '@domain/value-objects/animeId.vo';
import { RelationType } from '@domain/value-objects/relationType.vo';

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

    if (anime.isErr()) {
      return err(anime.error);
    }

    // 1. check relation anime
    const relationEntities: AnimeRelation[] = [];

    if (dto.relation?.length) {
      // 1.1 create anime id
      const animeIds = Result.combine(
        dto.relation.map((rela) => AnimeId.create(rela.relationAnimeId)),
      );

      if (animeIds.isErr()) return err(animeIds.error[0]);

      // 1.2 check anime id is exist
      const animeList = await this.animeRepository.isExistsManyId(
        animeIds.value,
      );

      const missingIds = animeIds.value.filter(
        (id) => !animeList.includes(id.toString()),
      );

      if (missingIds.length > 0) {
        return err(
          new AppError(
            'ANIME_NOT_FOUND',
            `Not found anime id: ${missingIds.join(', ')}`,
          ),
        );
      }

      // 1.3 create RelationType
      const relationTypes = Result.combine(
        dto.relation.map((rela) => RelationType.create(rela.relationType)),
      );

      if (relationTypes.isErr()) return err(relationTypes.error[0]);

      // 1.4 cycle check
    }

    const result = await this.unitOfWork.runInTransaction(async () => {
      return await this.animeRepository.isExistsOrInsert(anime.value);
    });

    if (result.isErr()) return err(result.error);

    return ok(anime.value);
  }
}
