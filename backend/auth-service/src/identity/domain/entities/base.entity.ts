export abstract class BaseEntity {
  abstract readonly id: string;
  abstract readonly createAt: Date;
  protected abstract _updateAt: Date;
}
