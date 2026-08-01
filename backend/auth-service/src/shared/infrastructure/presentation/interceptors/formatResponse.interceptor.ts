import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SuccessResponse } from '@packages/contracts/schema/successResponse.schema';
import { ZodType } from 'zod';

export class FormatResponse<T extends ZodType> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    const now = Date.now();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
      tap(() => {
        console.log(`Xử lý mất ${Date.now() - now}ms`);
      }),
      catchError((err: Error) => {
        console.error('Lỗi trong pipeline:', err.message);
        return throwError(() => err);
      }),
    );
  }
}
