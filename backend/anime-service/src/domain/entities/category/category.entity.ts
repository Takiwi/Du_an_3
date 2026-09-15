import { CategoryId } from '@domain/value-objects/categoryId.vo';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export class Category {
  private readonly _id: CategoryId;
  private _name: string;

  private constructor(id: CategoryId, name: string) {
    this._id = id;
    this._name = name;
  }

  static create(id: string, name: string): Result<Category, AppError> {
    const categoryId = CategoryId.create(id);

    if (categoryId.isErr()) return err(categoryId.error);

    return ok(new Category(categoryId.value, name));
  }

  static reconstitute(id: string, name: string) {
    const categoryId = CategoryId.reconstitute(id);

    return new Category(categoryId, name);
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }
}
