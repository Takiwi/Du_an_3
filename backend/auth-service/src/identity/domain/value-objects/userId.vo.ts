import { fail, ok, Result } from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import { DomainErrorCode } from '../errors/domain.error';
import { ValueObject } from '@packages/contracts/pattern/valueObject.pattern';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class UserId extends ValueObject<string> {
  private constructor(private readonly id: string) {
    super(id);
  }

  static create(id: string): Result<UserId, AppError> {
    if (!id || !UUID_V4_REGEX.test(id)) {
      return fail(
        new AppError(DomainErrorCode.INVALID_UUID, `UUID ${id} is invalid`),
      );
    }

    return ok(new UserId(id));
  }

  public static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  toString(): string {
    return this.id;
  }
}
