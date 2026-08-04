import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from '@packages/core/cls/cls.service';
import { mapErrorCodeToStatus } from './mapStatus';
import { AppError } from '@packages/core/errors/app.error';
import { ValidationFieldException } from '../errors/validationField.error';
import { ValidationDetailDto } from '../dto/responses/validationErrorDetail.dto';
import { ApiErrorResponseDto } from '../../../shared/presentation/dto/errorResponse.dto';

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
    let detailsError: ValidationDetailDto[] | undefined;

    if (exception instanceof AppError) {
      status = mapErrorCodeToStatus(exception.code);
      errorCode = exception.code;
      finalMessage = exception.message;
    }

    if (exception instanceof ValidationFieldException) {
      status = exception.getStatus();
      errorCode = exception.code;
      finalMessage = exception.message;
      detailsError = exception.details;
    }

    const result = new ApiErrorResponseDto(
      status === HttpStatus.INTERNAL_SERVER_ERROR ? false : true,
      errorCode,
      finalMessage,
      { requestId: requestId, timestamp: new Date().toISOString() },
    );

    response.status(status).json(result);
  }
}
