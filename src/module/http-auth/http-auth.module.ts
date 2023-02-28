import {Logger, Module} from '@nestjs/common';
import {ConfigureModule} from '@src-loader/configure/configure.module';
import {JwtStrategy} from '@src-module/http-auth/src/strategy/jwt.strategy';
import {APP_GUARD, Reflector} from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {EnvironmentEnv} from '@src-loader/configure/enum/environment.env';
import {FakeAuthGuard} from '@src-module/http-auth/src/guard/fake-auth.guard';
import {AccessAuthGuard} from '@src-module/http-auth/src/guard/access-auth.guard';

@Module({
  imports: [
    ConfigureModule,
  ],
  providers: [
    JwtStrategy,
    ConfigService,
    Logger,

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

        return new AccessAuthGuard(reflector);
      },
    },
  ],
})
export class HttpAuthModule {
}
