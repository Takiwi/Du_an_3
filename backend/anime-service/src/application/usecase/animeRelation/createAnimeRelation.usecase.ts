import { AnimeRelation } from '@domain/entities/animeRelation/animeRelation.entity';
import {
  ANIME_RELATION_REPOSITORY,
  IAnimeRelationRepository,
} from '@domain/repositories/IAnimeRelation.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { CreateAnimeRelationInput } from './animeRelation.contract';
import { err, ok, Result } from 'neverthrow';
import {
  ANIME_REPOSITORY,
  IAnimeRepository,
} from '@domain/repositories/IAnime.repository';
import {
  IUnitOfWork,
  TRANSACTION_ROLLBACK_ERROR,
} from '@application/ports/IUnitOfWork.port';

@Injectable()
export class CreateAnimeRelationUseCase {
  constructor(
    @Inject(ANIME_RELATION_REPOSITORY)
    private readonly animeRelationRepo: IAnimeRelationRepository,
    @Inject(ANIME_REPOSITORY)
    private readonly animeRepository: IAnimeRepository,
    @Inject(TRANSACTION_ROLLBACK_ERROR)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    input: CreateAnimeRelationInput,
  ): Promise<Result<AnimeRelation, AppError>> {
    const animeRelation = AnimeRelation.create(
      input.fromAnimeId,
      input.toAnimeId,
      input.relationType,
    );

    if (animeRelation.isErr()) return err(animeRelation.error);

    // check if anime is exists
    const [fromAnimeId, toAnimeId] = await this.animeRepository.findManyById([
      animeRelation.value.getFromAnimeId(),
      animeRelation.value.getToAnimeId(),
    ]);

    if (!fromAnimeId || !toAnimeId) {
      return err(
        new AppError(
          'ANIME_NOT_FOUND',
          `"From anime id (${fromAnimeId?.getId().toString()})" or "To anime id (${toAnimeId?.getId().toString()}) is not found"`,
        ),
      );
    }

    // Check whether two IDs belong to the same bidirectional relationship but have different "relationship types."
    const hasConflict = await this.animeRelationRepo.existsBetween(
      animeRelation.value.getFromAnimeId(),
      animeRelation.value.getToAnimeId(),
    );

    if (hasConflict) {
      return err(
        new AppError(
          'RELATION_ALREADY_EXISTS_BETWEEN_PAIR',
          `Invalid relation between "from id"(${input.fromAnimeId}) and "to id" (${input.toAnimeId})`,
        ),
      );
    }

    // check if the Id creates a loop
    if (AnimeRelation.HIERARCHICAL_TYPES.includes(input.relationType)) {
      const wouldCycle = await this.animeRelationRepo.isCreateCycle(
        animeRelation.value.getFromAnimeId(),
        animeRelation.value.getToAnimeId(),
      );

      if (wouldCycle) {
        return err(
          new AppError(
            'RELATION_WOULD_CREATE_CYCLE',
            `Relation ${input.fromAnimeId} and ${input.toAnimeId} create cycle`,
          ),
        );
      }
    }

    // save relation
    await this.unitOfWork.runInTransaction(async () => {
      await this.animeRelationRepo.insertAnimeRelation(animeRelation.value);

      return ok();
    });

    return ok(animeRelation.value);
  }
}
