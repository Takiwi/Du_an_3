import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from '@packages/core/cls/cls.service';
import { AppError } from '@packages/contracts/errors/app.error';
import { formatErrorResponse } from './formatErrorResponse';

@Injectable()
@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly clsService: ClsService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const requestId = this.clsService.get('requestId');

    if (exception instanceof AppError) {
      return response
        .status(300)
        .json(formatErrorResponse(exception, requestId));
    }

    return response.status(300).json({});
  }

  protected getRequestId(): string | undefined {
    return this.clsService.get('requestId');
  }
}
