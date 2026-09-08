import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from '@packages/request-context';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  RESPONSE_MESSAGE_KEY,
  ApiSuccessResponseDto,
} from '@packages/api-docs';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { SKIP_TRANSFORM } from '@presentation/decorators/skipResponseFormat';

@Injectable()
export class FormatResponse<T> implements NestInterceptor {
  constructor(
    private readonly clsService: ClsService,
    private readonly reflector: Reflector,
    @Inject(LOGGER_TOKEN)
    private readonly logger: ILogger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponseDto<T> | T> {
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return next.handle();

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
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }
}
