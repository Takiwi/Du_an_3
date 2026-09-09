import { err, ok, Result } from "neverthrow";
import { AppError } from "../errors/app.error";
import { randomUUID } from "crypto";

export abstract class EntityId {
  protected readonly _id: string;
  protected static readonly UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  protected constructor(value: string) {
    this._id = value;
  }

  protected static generateId() {
    return randomUUID();
  }

  protected static validateUUID(id: string): Result<void, AppError> {
    if (!EntityId.UUID_V4_REGEX.test(id)) {
      return err(
        new AppError("INVALID_UUID", `UUID ${id} has an invalid format`),
      );
    }
    return ok();
  }

  equals(other: EntityId): boolean {
    return this._id === other._id;
  }

  toString(): string {
    return this._id;
  }
}
