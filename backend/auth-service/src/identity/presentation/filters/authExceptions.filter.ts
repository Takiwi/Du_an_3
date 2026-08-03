import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from '@packages/core/cls/cls.service';
import { mapAppErrorToStatus } from './mapStatus';
import { AppError } from '@packages/core/errors/app.error';
import { ValidationFieldException } from '../errors/validationField.error';

@Injectable()
@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly clsService: ClsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = this.clsService.get('requestId') ?? '123';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let finalMessage = 'An unexpected error occurred. Please try again later.';
    let detailsError: Record<string, unknown>[] | undefined = undefined;

    if (exception instanceof AppError) {
      status = mapAppErrorToStatus(exception);
      errorCode = exception.code;
      finalMessage = exception.message;
      detailsError = exception.details;
    }

    if (exception instanceof ValidationFieldException) {
      status = exception.getStatus();
      errorCode = exception.code;
      finalMessage = exception.message;
      detailsError = exception.details;
    }

    response.status(status).json({
      success: false,
      isOperational: status.valueOf() < 500 ? true : false,
      requestId: requestId,
      error: {
        code: errorCode,
        message: finalMessage,
        details: detailsError,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
