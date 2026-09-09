import { randomUUID } from "node:crypto";

export abstract class EntityId {
  protected readonly _id: string;

  protected constructor(value: string) {
    this._id = value;
  }

  protected static generateId() {
    return randomUUID();
  }

  equals(other: EntityId): boolean {
    return this._id === other._id;
  }

  toString(): string {
    return this._id;
  }
}
