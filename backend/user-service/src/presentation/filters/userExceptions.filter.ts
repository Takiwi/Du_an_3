import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Injectable,
  NotFoundException,
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
import { Prisma } from '@generated/prisma/client';

@Injectable()
@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly clsService: ClsService,
    @Inject(LOGGER_TOKEN) private readonly logger: ILogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const requestId = this.clsService.get('requestId') ?? '';
    const timestamp = new Date().toISOString();

    if (exception instanceof AppError) {
      const code = exception.code as keyof typeof ERROR_DEFINITIONS;
      const definition = ERROR_DEFINITIONS[code];
      const status = definition?.status ?? 400;
      const finalMessage = definition?.message ?? exception.message;

      const result = new ApiErrorResponseDto(exception.code, finalMessage, {
        requestId: requestId,
        timestamp: timestamp,
      });

      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.code} - ${exception.message}`,
      );

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

      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.code} - ${exception.message}`,
      );

      return response.status(status).json(result);
    }

    // Prisma error
    if (
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError
    ) {
      this.logger.error(exception.message, exception);

      return response.status(500).json(exception.message);
    }

    if (exception instanceof NotFoundException) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception.message}`,
      );

      return response
        .status(404)
        .json(
          new ApiErrorResponseDto(
            'NOT_FOUND',
            'Not found error',
            { requestId: requestId, timestamp: timestamp },
            true,
          ),
        );
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
