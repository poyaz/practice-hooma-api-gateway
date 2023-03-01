import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {GrpcMsConfigInterface} from '@src-loader/configure/interface/grpc-ms-config.interface';
import {USERS_PACKAGE_NAME, USERS_SERVICE_NAME} from '@src-module/users-grpc/src/controller/users.pb';
import {UsersGrpcController} from '@src-module/users-grpc/src/controller/users-grpc.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERS_SERVICE_NAME,
        imports: [],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<GrpcMsConfigInterface>('users-ms').grpc.url,
            package: USERS_PACKAGE_NAME,
            protoPath: 'node_modules/proto-users/users.proto',
          },
        }),
      },
    ]),
  ],
  controllers: [UsersGrpcController],
  providers: [ConfigService],
})
export class UsersGrpcModule {
}
