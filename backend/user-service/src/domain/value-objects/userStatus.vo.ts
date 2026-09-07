import { AppError, ValueObject } from '@packages/pattern';
import { Result, err, ok } from 'neverthrow';

export type STATUS = 'ACTIVE' | 'BANNED' | 'DEACTIVATED';

export class UserStatus extends ValueObject<{ status: string }> {
  private constructor(status: string) {
    super({ status });
  }

  static create(status: string): Result<UserStatus, AppError> {
    if (!['ACTIVE', 'BANNED', 'DEACTIVATED'].includes(status)) {
      return err(new AppError('INVALID_USER_STATUS', ''));
    }

    return ok(new UserStatus(status as STATUS));
  }

  static active() {
    return new UserStatus('ACTIVE');
  }

  static reconstitute(status: string) {
    return new UserStatus(status);
  }

  getUserStatus(): STATUS {
    return this.props.status as STATUS;
  }
}
