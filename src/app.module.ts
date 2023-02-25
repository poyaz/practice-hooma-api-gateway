import {Logger, Module} from '@nestjs/common';
import {ConfigureModule} from '@src-loader/configure/configure.module';
import {ConfigService} from '@nestjs/config';
import {LoggerModule} from 'nestjs-pino';
import {HttpAuthModule} from '@src-module/http-auth/http-auth.module';
import {AuthGrpcModule} from './module/auth-grpc/auth-grpc.module';
import {DefaultController} from '@src-api/http/controller/default-controller';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {OutputTransferInterceptor} from '@src-api/http/interceptor/output.transfer.interceptor';

@Module({
  imports: [
    ConfigureModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        genReqId: () => null,
        quietReqLogger: true,
        transport: {target: 'pino-pretty'},
      },
    }),
    HttpAuthModule,
    AuthGrpcModule,
  ],
  controllers: [DefaultController],
  providers: [
    Logger,
    ConfigService,

    {
      provide: APP_INTERCEPTOR,
      useClass: OutputTransferInterceptor,
    },
  ],
})
export class AppModule {
}
