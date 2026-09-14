import {
  ArgumentsHost,
  Catch,
  Injectable,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppError } from '@packages/pattern';
import { mapAppErrorToGrpc } from '@packages/grpc-contracts';
import { Observable, throwError } from 'rxjs';

@Injectable()
@Catch(AppError)
export class GrpcExceptionFilter implements RpcExceptionFilter<AppError> {
  catch(exception: AppError, host: ArgumentsHost): Observable<any> {
    return throwError(() => new RpcException(mapAppErrorToGrpc(exception)));
  }
}
