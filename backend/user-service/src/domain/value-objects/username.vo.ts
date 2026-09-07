import { AppError, ValueObject } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';
import { RESERVED_USERNAMES } from '../constants/username.blacklist';

export class Username extends ValueObject<{
  username: string;
  _lastUsernameChangedAt: Date | null;
}> {
  static readonly MINIMUM_LENGTH = 3;
  static readonly MAXIMUM_LENGTH = 30;
  static readonly REGEX = /^[a-zA-Z0-9]+$/;
  static readonly GRACE_PERIOD = 30 * 24 * 60 * 60 * 1000;

  private constructor(username: string, changeAt: Date | null) {
    super({ username, _lastUsernameChangedAt: changeAt });
  }

  static create(
    username: string,
    changeAt: Date | null = null,
  ): Result<Username, AppError> {
    const trimmedUsername = username.trim();

    if (
      trimmedUsername.length < Username.MINIMUM_LENGTH ||
      trimmedUsername.length > Username.MAXIMUM_LENGTH
    ) {
      return err(
        new AppError(
          'USERNAME_INVALID_LENGTH',
          'The username must be between 3 and 30 characters long',
        ),
      );
    }

    if (!Username.REGEX.test(trimmedUsername)) {
      return err(
        new AppError('USERNAME_INVALID_CHARS', 'Invalid username format'),
      );
    }

    if (RESERVED_USERNAMES.has(trimmedUsername.toLowerCase())) {
      return err(new AppError('USERNAME_RESERVED', 'Invalid username'));
    }

    return ok(new Username(trimmedUsername, changeAt));
  }

  static firstUsername(username: string): Result<Username, AppError> {
    return this.create(username, null);
  }

  static reconstitute(username: string, changeAt: Date | null) {
    return new Username(username, changeAt);
  }

  private canChangeUsername(now: Date): Result<void, AppError> {
    if (this.props._lastUsernameChangedAt) {
      const elapsed =
        now.getTime() - this.props._lastUsernameChangedAt.getTime();

      if (elapsed < Username.GRACE_PERIOD) {
        const remainingDays = Math.ceil(
          (Username.GRACE_PERIOD - elapsed) / (24 * 60 * 60 * 1000),
        );
        return err(
          new AppError(
            'USERNAME_CHANGE_COOLDOWN',
            `There are still ${remainingDays} days left before you can change your username.`,
          ),
        );
      }
    }

    return ok();
  }

  changeUsername(newUsername: string, now: Date): Result<Username, AppError> {
    const canChange = this.canChangeUsername(now);

    if (canChange.isErr()) return err(canChange.error);

    const usernameResult = Username.create(newUsername, now);

    if (usernameResult.isErr()) return err(usernameResult.error);

    return ok(usernameResult.value);
  }

  toString() {
    return this.props.username;
  }

  getLastUsernameChangedAt() {
    return this.props._lastUsernameChangedAt;
  }
}
