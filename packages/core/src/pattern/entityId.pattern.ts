import { fail, ok, Result, unwrapResult } from "../helpers/resultPattern.js";

export abstract class EntityId {
  protected readonly _value: string;
  protected static readonly UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  protected constructor(value: string) {
    if (!EntityId.UUID_V4_REGEX.test(value)) {
      throw new Error(`UUID ${value} has an invalid format`);
    }

    this._value = value;
  }

  // Pure validation check
  public static isValid(id: string): boolean {
    return EntityId.UUID_V4_REGEX.test(id);
  }

  equals(other: EntityId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

// label for id in each entity
export class UserId extends EntityId {}
export class RefreshTokenId extends EntityId {}
