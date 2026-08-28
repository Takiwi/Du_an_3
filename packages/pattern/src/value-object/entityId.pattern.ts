import { fail, ok, Result } from "../result/result.pattern";

export abstract class EntityId {
  protected readonly _value: string;
  protected static readonly UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  protected constructor(value: string) {
    this._value = value;
  }

  // Pure validation check
  protected static validateUUID(id: string): Result<void, Error> {
    if (!EntityId.UUID_V4_REGEX.test(id)) {
      return fail(new Error(`UUID ${id} has an invalid format`));
    }
    return ok();
  }

  equals(other: EntityId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
