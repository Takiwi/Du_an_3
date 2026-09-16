import { AnimeId } from '@domain/value-objects/animeId.vo';
import { AnimeRelationId } from '@domain/value-objects/animeRelationId.vo';
import { RelationType } from '@domain/value-objects/relationType.vo';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class AnimeRelation {
  static HIERARCHICAL_TYPES = ['PREQUEL', 'SEQUEL', 'SPIN_OFF'];

  private readonly _id: AnimeRelationId;
  private _fromAnimeId: AnimeId;
  private _toAnimeId: AnimeId;
  private _relationType: RelationType;

  private constructor(
    id: AnimeRelationId,
    fromAnimeId: AnimeId,
    toAnimeId: AnimeId,
    relationType: RelationType,
  ) {
    this._id = id;
    this._fromAnimeId = fromAnimeId;
    this._toAnimeId = toAnimeId;
    this._relationType = relationType;
  }

  static create(
    fromAnimeId: string,
    toAnimeId: string,
    relationType: string,
  ): Result<AnimeRelation, AppError> {
    if (fromAnimeId === toAnimeId) {
      return err(
        new AppError(
          'CANNOT_RELATE_TO_SELF',
          `From Anime id ${fromAnimeId} and to anime id ${toAnimeId} must be difference`,
        ),
      );
    }

    const id = AnimeId.createId();

    const combined = Result.combine([
      AnimeId.create(fromAnimeId),
      AnimeId.create(toAnimeId),
      RelationType.create(relationType),
    ]);

    if (combined.isErr()) return err(combined.error[0]);

    const [fromAnimeIdResult, toAnimeIdResult, relationTypeResult] =
      combined.value;

    return ok(
      new AnimeRelation(
        id,
        fromAnimeIdResult,
        toAnimeIdResult,
        relationTypeResult,
      ),
    );
  }

  getId() {
    return this._id;
  }

  getFromAnimeId() {
    return this._fromAnimeId;
  }

  getToAnimeId() {
    return this._toAnimeId;
  }

  getRelationType() {
    return this._relationType;
  }
}
