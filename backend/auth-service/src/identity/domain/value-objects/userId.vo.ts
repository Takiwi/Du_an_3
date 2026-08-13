import { fail, ok, Result } from '@packages/contracts/helpers/resultPattern';
import { AppError } from '@packages/core/errors/app.error';
import { DomainErrorCode } from '../errors/domain.error';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class UserId {
  private constructor(private readonly value: string) {}

  static create(value: string): Result<UserId, AppError> {
    if (!value || !UUID_V4_REGEX.test(value)) {
      return fail(
        new AppError(DomainErrorCode.INVALID_UUID, `UUID ${value} is invalid`),
      );
    }

    return ok(new UserId(value));
  }

  equals(order: UserId): boolean {
    return this.value === order.value;
  }

  toString(): string {
    return this.value;
  }
}
