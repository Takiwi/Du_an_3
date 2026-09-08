import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ILogger, LOGGER_TOKEN } from '@packages/logging';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: ILogger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // const rpcContext = context.switchToRpc();

    const handlerName = context.getHandler().name;
    const className = context.getClass().name;

    this.logger.info(`[Incoming Request] ${className}.${handlerName}`);

    return next.handle();
  }
}
