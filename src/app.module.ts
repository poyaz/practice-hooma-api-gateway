import {Logger, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ConfigureModule} from '@src-loader/configure/configure.module';
import {ConfigService} from '@nestjs/config';
import {LoggerModule} from 'nestjs-pino';
import {APP_GUARD, Reflector} from '@nestjs/core';
import {EnvironmentEnv} from '@src-loader/configure/enum/environment.env';
import {FakeAuthGuard} from '@src-api/http/guard/fake-auth.guard';
import {JwtAuthGuard} from '@src-api/http/guard/jwt-auth.guard';

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
  ],
  controllers: [],
  providers: [
    Logger,
    ConfigService,

    {
      provide: APP_GUARD,
      inject: [ConfigService, Reflector, Logger],
      useFactory: (configService: ConfigService, reflector: Reflector, logger: Logger) => {
        const NODE_ENV = configService.get<string>('NODE_ENV', '');
        const FAKE_AUTH_GUARD = configService.get<boolean>('FAKE_AUTH_GUARD', false);

        if ((NODE_ENV === '' || NODE_ENV === EnvironmentEnv.DEVELOP) && FAKE_AUTH_GUARD) {
          logger.warn(`Auth guard has been faked because you use "FAKE_AUTH_GUARD=${process.env.FAKE_AUTH_GUARD}" variable!`, 'AuthGuardFactory');
          return new FakeAuthGuard(reflector);
        }

        return new JwtAuthGuard(reflector);
      },
    },
  ],
})
export class AppModule {
}
