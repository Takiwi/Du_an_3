import { RelationTypes } from '@domain/entities/animeRelation/animeRelation.contract';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class RelationType {
  private constructor(private readonly value: RelationTypes) {}

  static create(value: string): Result<RelationType, AppError> {
    if (
      !['SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE'].includes(
        value,
      )
    ) {
      return err(
        new AppError(
          'INVALID_RELATION_TYPE',
          `Relation type ${value} is invalid`,
        ),
      );
    }

    return ok(new RelationType(value as RelationTypes));
  }

  getInverse(): RelationType | null {
    const map: Partial<Record<RelationTypes, RelationTypes>> = {
      SEQUEL: 'PREQUEL',
      PREQUEL: 'SEQUEL',
    };

    const inverse = map[this.value];
    return inverse ? new RelationType(inverse) : null;
  }

  getValue() {
    return this.value;
  }
}
