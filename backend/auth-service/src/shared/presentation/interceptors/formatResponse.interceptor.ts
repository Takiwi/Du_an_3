import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from '@packages/core/cls/cls.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../../decorators/apiSuccessResponse.decorator';
import { ApiSuccessResponseDto } from '../dto/successResponse.dto';
import { ILogger, LOGGER_TOKEN } from '@packages/core/logging/ILogger.post';

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
  ): Observable<ApiSuccessResponseDto<T>> {
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
      catchError((err: Error) => {
        this.logger.error(err.name, err);
        return throwError(() => err);
      }),
    );
  }
}
