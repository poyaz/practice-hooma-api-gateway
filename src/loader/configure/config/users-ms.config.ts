import {registerAs} from '@nestjs/config';
import {GrpcMsConfigInterface} from '@src-loader/configure/interface/grpc-ms-config.interface';

export default registerAs('users-ms', (): GrpcMsConfigInterface => {
  return {
    grpc: {
      url: process.env.GRPC_USERS_MS_URL,
    },
  };
});
