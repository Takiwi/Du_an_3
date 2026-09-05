import { AppError, ValueObject } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';

export class Password extends ValueObject<{ value: string }> {
  private static readonly MINIMUM_SIZE = 8;
  private static readonly MAXIMUM_SIZE = 64;
  private static readonly UPPERCASE_LETTERS_REGEX = /[A-Z]/;
  private static readonly LOWERCASE_LETTERS_REGEX = /[a-z]/;
  private static readonly NUMBER_REGEX = /\d/;
  private static readonly SPECIAL_CHARACTERS_REGEX = /[@$!%*?&]/;
  private static readonly LATIN_ONLY_REGEX =
    /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

  private constructor(props: { value: string }) {
    super(props);
  }

  static create(rawPassword: string): Result<Password, AppError> {
    if (!rawPassword)
      return err(
        new AppError('INVALID_PASSWORD', `Invalid password: ${rawPassword}`),
      );

    const trimmedPassword = rawPassword.trim();

    const result = this.isInvalidPassword(trimmedPassword);

    if (!result.isOk()) return err(result.error);

    return ok(new Password({ value: trimmedPassword }));
  }

  static reconstitute(rawPassword: string) {
    return new Password({ value: rawPassword });
  }

  static isInvalidPassword(rawPassword: string): Result<boolean, AppError> {
    if (!Password.LATIN_ONLY_REGEX.test(rawPassword)) {
      return err(
        new AppError(
          'PASSWORD_FORMAT',
          'Passwords may only contain unaccented Latin characters, numbers, and standard keyboard special characters.',
        ),
      );
    }

    if (
      rawPassword.length < Password.MINIMUM_SIZE ||
      rawPassword.length > Password.MAXIMUM_SIZE
    ) {
      return err(
        new AppError(
          'PASSWORD_FORMAT',
          'The password must be between 8 and 64 characters long',
        ),
      );
    }

    if (!Password.UPPERCASE_LETTERS_REGEX.test(rawPassword)) {
      return err(
        new AppError(
          'PASSWORD_FORMAT',
          'The password must contain at least one uppercase letter',
        ),
      );
    }

    if (!Password.LOWERCASE_LETTERS_REGEX.test(rawPassword)) {
      return err(
        new AppError(
          'PASSWORD_FORMAT',
          'The password must contain at least one lowercase letter',
        ),
      );
    }

    if (!Password.NUMBER_REGEX.test(rawPassword)) {
      return err(
        new AppError(
          'PASSWORD_FORMAT',
          'The password must contain at least one digit',
        ),
      );
    }

    if (!Password.SPECIAL_CHARACTERS_REGEX.test(rawPassword)) {
      return err(
        new AppError(
          'PASSWORD_FORMAT',
          'The password must contain at least one special character (@$!%*?&)',
        ),
      );
    }

    return ok(true);
  }

  toString() {
    return this.props.value;
  }
}
