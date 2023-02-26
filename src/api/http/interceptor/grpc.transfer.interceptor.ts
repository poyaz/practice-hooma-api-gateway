import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable, Logger,
  NestInterceptor,
} from '@nestjs/common';
import {catchError, map, Observable, tap} from 'rxjs';
import {PinoLogger} from 'nestjs-pino';
import {Metadata, status} from '@grpc/grpc-js';

const HTTP_CODE_FROM_GRPC: Record<number, number> = {
  [status.OK]: HttpStatus.OK,
  [status.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
  [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
  [status.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
  [status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
  [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
  [status.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
  [status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
  [status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAVAILABLE]: HttpStatus.NOT_FOUND,
  [status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};

@Injectable()
export class GrpcTransferInterceptor implements NestInterceptor {
  constructor(
    @Inject(PinoLogger)
    private readonly _logger: PinoLogger,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        if (request.method === 'DELETE') {
          return '';
        }

        let isResultFind = false;
        let status;
        if (typeof data !== undefined && data !== undefined && data !== null) {
          isResultFind = true;

          status = data.status;
          delete data.status;
        }

        return {
          status: status || 'success',
          ...(isResultFind && {data}),
        };
      }),
      catchError((err) => {
        let action: string;
        let message: Array<string> | string;

        if (err.metadata) {
          const resMeta = new Metadata();
          resMeta.merge(err.metadata);

          action = resMeta.get('action')[0].toString();
          message = resMeta.get('message').map((v) => v.toString());

          const isOperation = (resMeta.get('isOperation')[0] || '0').toString().toLocaleLowerCase();
          if (['false', 'f', '0'].indexOf(isOperation) !== -1) {
            this._logger.error(err);
          }
        }

        const statusCode = HTTP_CODE_FROM_GRPC[err.code] || HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException({
          statusCode: statusCode,
          message: message || err.message,
          action: action || 'UNKNOWN_ERROR',
          error: err.details,
        }, statusCode);
      }),
    );
  }
}
