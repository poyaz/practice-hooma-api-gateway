import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable, Logger,
  NestInterceptor,
} from '@nestjs/common';
import {catchError, map, Observable} from 'rxjs';
import {PinoLogger} from 'nestjs-pino';

@Injectable()
export class OutputTransferInterceptor implements NestInterceptor {
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
        if (typeof data !== undefined && data !== undefined && data !== null) {
          isResultFind = true;
        }

        return {
          status: 'success',
          ...(isResultFind && {data}),
        };
      }),
      catchError((err) => {
        let statusCode: number = err.statusCode || 400;
        let error: string;

        if (!err.isOperation) {
          this._logger.error(err);
        }

        throw new HttpException({
          statusCode: statusCode,
          message: err.message,
          action: err.name,
          err,
        }, statusCode);
      }),
    );
  }
}
