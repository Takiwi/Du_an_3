import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';
import { ValidationFieldException } from '../errors/validationField.error';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = result.error.issues.map((issues) => ({
        field: issues.path.join(','),
        message: issues.message,
      }));

      throw new ValidationFieldException(errors);
    }

    return result.data;
  }
}
