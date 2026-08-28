import { ValueObject } from '@packages/pattern';

export type STATUS = 'PENDING' | 'ACTIVE' | 'BANNED' | 'DEACTIVATED';

export class AccountStatus extends ValueObject<{ status: STATUS }> {
  static readonly MAX_FAIL_LOGIN = 5;

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
}
