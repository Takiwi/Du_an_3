import { AppError, ValueObject } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export type STATUS = 'PENDING' | 'ACTIVE' | 'BANNED' | 'DEACTIVATED';

export class AccountStatus extends ValueObject<{ status: STATUS }> {
  static readonly MAX_FAIL_LOGIN = 5;

  private constructor(props: { status: STATUS }) {
    super(props);
  }

  static create(status: string): Result<AccountStatus, AppError> {
    if (!['PENDING', 'ACTIVE', 'BANNED', 'DEACTIVATED'].includes(status)) {
      return err(new AppError('INVALID_STATUS', `Invalid status: ${status}`));
    }

    return ok(new AccountStatus({ status: status as STATUS }));
  }

  static reconstitute(status: string) {
    return new AccountStatus({ status: status as STATUS });
  }

  static active() {
    return new AccountStatus({ status: 'ACTIVE' });
  }

  static banned() {
    return new AccountStatus({ status: 'BANNED' });
  }

  recordFailedLogin(currentAttempts: number): AccountStatus {
    if (currentAttempts >= AccountStatus.MAX_FAIL_LOGIN) {
      return AccountStatus.banned();
    }

    return this;
  }

  public currentStatus(): STATUS {
    return this.props.status;
  }

  public isBanned(): boolean {
    return this.props.status === 'BANNED';
  }

  public toString(): string {
    return this.props.status;
  }
}
