import { sagaStep } from '@application/ports/sagaStep.port';
import { Injectable } from '@nestjs/common';
import { AppError } from '@packages/pattern';
import { ok, Result } from 'neverthrow';

@Injectable()
export class SagaRunner {
  async run<T>(steps: sagaStep<any>[]): Promise<Result<T, AppError>> {
    const completed: Array<{
      step: sagaStep<any>;
      value: any;
    }> = [];

    for (const step of steps) {
      const result = await step.execute();

      if (result.isErr()) {
        await this.compensate(completed);

        return result;
      }

      completed.push({
        step,
        value: result.value as T,
      });
    }

    return ok(completed[completed.length - 1]?.value);
  }

  private async compensate(
    completed: Array<{
      step: sagaStep<any>;
      value: any;
    }>,
  ) {
    for (const { step, value } of completed) {
      await step.compensate(value);
    }
  }
}
