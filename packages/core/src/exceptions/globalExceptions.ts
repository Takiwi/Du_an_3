import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  //   private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.headers["x-request-id"];

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal service error";
    let isOperational = false;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContext = exception.getResponse();
      message =
        typeof resContext === "object" &&
        resContext !== null &&
        "message" in resContext
          ? (resContext as any).message
          : exception.message;
      isOperational = (exception as any).isOperational ?? true;
    }

    // Log full chi tiết nội bộ, bất kể có expose ra client hay không
    // this.logger.error({
    //   requestId,
    //   path: request.url,
    //   status,
    //   message: exception instanceof Error ? exception.message : 'Unknown error',
    //   stack: exception instanceof Error ? exception.stack : undefined,
    // });

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message: isOperational ? message : "Internal service error",
        requestId,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
