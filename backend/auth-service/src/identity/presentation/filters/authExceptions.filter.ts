import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Injectable,
  // InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from '@packages/request-context';
import { AppError } from '@packages/pattern';
import { ValidationFieldException } from '../errors/validationField.error';
import {
  ApiErrorResponseDto,
  ValidationErrorResponseDto,
} from '@packages/api-docs';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { ERROR_DEFINITIONS } from '../configs/error.config';

@Injectable()
@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly clsService: ClsService,
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = this.clsService.get('requestId') ?? '';
    const timestamp = new Date().toISOString();

    if (exception instanceof AppError) {
      const code = exception.code as keyof typeof ERROR_DEFINITIONS;
      const status = ERROR_DEFINITIONS[code].status;
      const message = ERROR_DEFINITIONS[code].message;

      const result = new ApiErrorResponseDto(exception.code, message, {
        requestId: requestId,
        timestamp: timestamp,
      });

      this.logger.error(exception.message, exception);

      return response.status(status).json(result);
    }

    if (exception instanceof ValidationFieldException) {
      const status = exception.getStatus();
      const detailsError = exception.details;

      const result = new ValidationErrorResponseDto(
        exception.code,
        exception.message,
        { requestId: requestId, timestamp: timestamp },
        detailsError,
      );

      this.logger.error(exception.message, exception);

      return response.status(status).json(result);
    }

    const request = host.switchToHttp().getRequest<Request>();
    this.logger.error(`[${request.method}] ${request.url}`);

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception, {
        stack: exception.stack,
      });
    }

    return response
      .status(500)
      .json(
        new ApiErrorResponseDto(
          'INTERNAL_SERVER_ERROR',
          'An unexpected error occurred. Please try again later.',
          { requestId: requestId, timestamp: timestamp },
          false,
        ),
      );
  }
}
