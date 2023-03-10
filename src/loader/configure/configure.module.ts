import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {resolve} from 'path';
import {envValidate} from './validate/env.validation';
import serverConfig from './config/server.config';
import jwtConfig from './config/jwt.config';
import authMsConfig from '@src-loader/configure/config/auth-ms.config';
import usersMsConfig from '@src-loader/configure/config/users-ms.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: resolve('env', 'app', '.env'),
      validate: envValidate,
      load: [
        serverConfig,
        jwtConfig,
        authMsConfig,
        usersMsConfig,
      ],
    }),
  ],
})
export class ConfigureModule {
}
