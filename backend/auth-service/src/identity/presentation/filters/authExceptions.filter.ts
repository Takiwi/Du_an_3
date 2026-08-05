import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from '@packages/core/cls/cls.service';
import { mapErrorCodeToStatus } from './mapStatus';
import { AppError } from '@packages/core/errors/app.error';
import { ValidationFieldException } from '../errors/validationField.error';
import { ApiErrorResponseDto } from '../../../shared/presentation/dto/errorResponse.dto';
import { ValidationErrorResponseDto } from '../../../shared/presentation/dto/validationErrorResponse.dto';

@Injectable()
@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly clsService: ClsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = this.clsService.get('requestId') ?? '';
    const timestamp = new Date().toISOString();

    if (exception instanceof AppError) {
      const status = mapErrorCodeToStatus(exception.code);

      const result = new ApiErrorResponseDto(
        exception.code,
        exception.message,
        { requestId: requestId, timestamp: timestamp },
      );

      response.status(status).json(result);
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

      response.status(status).json(result);
    }

    response
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
