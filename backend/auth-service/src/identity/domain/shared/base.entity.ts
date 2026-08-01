export abstract class BaseEntity {
  abstract readonly id: string;
  abstract readonly createdAt: Date;
  protected abstract _updatedAt: Date;
}
