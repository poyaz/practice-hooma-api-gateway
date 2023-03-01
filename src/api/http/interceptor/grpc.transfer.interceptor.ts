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
  [status.UNKNOWN]: HttpStatus.BAD_REQUEST,
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
  [status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  [status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};

type ErrorObj = { action: string, message: Array<string> | string, isOperation: boolean }

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
        const errorObj = this._convertGrpcMetadata(err);
        if (!errorObj.isOperation) {
          console.error(err);
        }

        const statusCode = HTTP_CODE_FROM_GRPC[err.code] || HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException({
          statusCode: statusCode,
          message: errorObj.message,
          action: errorObj.action,
          error: err.details,
        }, statusCode);
      }),
    );
  }

  private _convertGrpcMetadata(err): ErrorObj {
    const errorObj: ErrorObj = {
      action: 'UNKNOWN_ERROR',
      message: err.message || 'Unknown message',
      isOperation: false,
    };

    if (!err.metadata) {
      return errorObj;
    }

    const resMeta = new Metadata();
    resMeta.merge(err.metadata);

    const actionMeta = (resMeta.get('action')[0] || '').toString();
    if (actionMeta) {
      errorObj.action = actionMeta;
    }

    const messageArrLenMeta = (resMeta.get('message-arr-len')[0] || '').toString();
    if (messageArrLenMeta) {
      const messageArrLen = Number(messageArrLenMeta);
      if (!isNaN(messageArrLen)) {
        const message = [];
        for (let i = 0; i < messageArrLen; i++) {
          message.push(resMeta.get(`message-${i}`)[0].toString());
        }

        errorObj.message = message;
      }
    }

    const isOperationMeta = (resMeta.get('is-operation')[0] || '0').toString().toLocaleLowerCase();
    errorObj.isOperation = isOperationMeta !== '0';

    return errorObj;
  }
}
