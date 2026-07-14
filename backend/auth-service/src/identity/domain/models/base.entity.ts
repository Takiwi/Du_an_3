export abstract class BaseEntity {
  abstract readonly id: string;
  abstract readonly createAt: Date;
  protected abstract updateAt: Date;
}
