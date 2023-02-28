import { Test, TestingModule } from '@nestjs/testing';
import { AuthGrpcController } from './auth-grpc.controller';

describe('AuthGrpcController', () => {
  let controller: AuthGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGrpcController],
    }).compile();

    controller = module.get<AuthGrpcController>(AuthGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
