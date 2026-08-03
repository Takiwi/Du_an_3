import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from '@packages/core/cls/cls.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

@Injectable()
export class FormatResponse<T> implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    const now = Date.now();

    return next.handle().pipe(
      map((data): SuccessResponse<T> => ({
        success: true,
        data,
        meta: {
          requestId: this.clsService.get('requestId') ?? '',
          timestamp: new Date().toISOString(),
        },
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
