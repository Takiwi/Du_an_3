import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const rpcContext = context.switchToRpc();

    const handlerName = context.getHandler().name;
    const className = context.getClass().name;

    const data = rpcContext.getData();
    const metadata = rpcContext.getContext();

    console.log(`[Incoming Request] ${className}.${handlerName}`);
    console.log(`Payload: ${JSON.stringify(data)}`);

    return next.handle();
  }
}
