import {registerAs} from '@nestjs/config';
import {GrpcMsConfigInterface} from '@src-loader/configure/interface/grpc-ms-config.interface';

export default registerAs('auth-ms', (): GrpcMsConfigInterface => {
  return {
    grpc: {
      url: process.env.GRPC_AUTH_MS_URL,
    },
  };
});
