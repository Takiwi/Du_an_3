import { ValueObject } from '@packages/pattern';

export type STATUS = 'ACTIVE' | 'BANNED' | 'DEACTIVATED';

export class UserStatus extends ValueObject<{ status: string }> {
  private constructor(status: string) {
    super({ status });
  }

  static create(status: STATUS): UserStatus {
    return new UserStatus(status);
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
