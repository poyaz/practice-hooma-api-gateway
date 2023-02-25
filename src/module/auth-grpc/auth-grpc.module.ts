import {Module} from '@nestjs/common';
import {AuthGrpcController} from '@src-module/auth-grpc/src/controller/auth-grpc.controller';
import {AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME} from '@src-module/auth-grpc/src/controller/auth.pb';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigureModule} from '@src-loader/configure/configure.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {GrpcMsConfigInterface} from '@src-loader/configure/interface/grpc-ms-config.interface';

@Module({
  imports: [
    ConfigureModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<GrpcMsConfigInterface>('auth-ms').grpc.url,
            package: AUTH_PACKAGE_NAME,
            protoPath: 'node_modules/proto-auth/auth.proto',
          },
        }),
      },
    ]),
  ],
  controllers: [AuthGrpcController],
  providers: [ConfigService],
})
export class AuthGrpcModule {
}
