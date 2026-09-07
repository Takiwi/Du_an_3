import { AppError, ValueObject } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export type STATUS = 'LOCKED' | 'EMAIL_UNVERIFIED' | 'VERIFIED';

export class AccountStatus extends ValueObject<{ status: STATUS }> {
  static readonly MAX_FAIL_LOGIN = 5;

  private constructor(props: { status: STATUS }) {
    super(props);
  }

  static create(status: string): Result<AccountStatus, AppError> {
    if (!['LOCKED', 'EMAIL_UNVERIFIED', 'VERIFIED'].includes(status)) {
      return err(new AppError('INVALID_STATUS', `Invalid status: ${status}`));
    }

    return ok(new AccountStatus({ status: status as STATUS }));
  }

  static reconstitute(status: string) {
    return new AccountStatus({ status: status as STATUS });
  }

  static active() {
    return new AccountStatus({ status: 'VERIFIED' });
  }

  static locked() {
    return new AccountStatus({ status: 'LOCKED' });
  }

  recordFailedLogin(currentAttempts: number): AccountStatus {
    if (currentAttempts >= AccountStatus.MAX_FAIL_LOGIN) {
      return AccountStatus.locked();
    }

    return this;
  }

  public currentStatus(): STATUS {
    return this.props.status;
  }

  public isLocked(): boolean {
    return this.props.status === 'LOCKED';
  }

  public toString(): string {
    return this.props.status;
  }
}
