import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from '@packages/core/cls/cls.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../../decorators/apiSuccessResponse.decorator';
import { ApiSuccessResponseDto } from '../dto/successResponse.dto';

@Injectable()
export class FormatResponse<T> implements NestInterceptor {
  constructor(
    private readonly clsService: ClsService,
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponseDto<T>> {
    const now = Date.now();

    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data): ApiSuccessResponseDto<T> => ({
        success: true,
        message: message ?? null,
        data: data ?? null,
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
