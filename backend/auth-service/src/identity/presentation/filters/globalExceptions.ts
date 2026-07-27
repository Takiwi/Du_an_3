import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppError } from '@packages/contracts/errors/app.error';
import { formatErrorResponse } from '@packages/contracts/utils/formatErrorResponse';
import { AUTH_ERROR_CODES } from '@packages/contracts/constants/authErrorCode';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  //   private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.headers['x-request-id'];

    if (exception instanceof AppError) {
      const status = AUTH_ERROR_CODES[exception.code].status;
      const message = AUTH_ERROR_CODES[exception.code].message;

      return response
        .status(status)
        .json(formatErrorResponse(exception, requestId));
    }

    return response
      .status(500)
      .json(
        formatErrorResponse(
          new AppError('INTERNAL_SERVER_ERROR', 'Internal server error'),
          requestId,
        ),
      );
  }
}
