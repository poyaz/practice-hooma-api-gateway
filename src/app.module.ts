import {Logger, Module} from '@nestjs/common';
import {ConfigureModule} from '@src-loader/configure/configure.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {LoggerModule} from 'nestjs-pino';
import {JwtModule, JwtService} from '@nestjs/jwt';
import { HttpAuthModule } from '@src-module/http-auth/http-auth.module';

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
  ],
  controllers: [],
  providers: [
    Logger,
    ConfigService,
  ],
})
export class AppModule {
}
