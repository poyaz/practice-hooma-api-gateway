import { Test, TestingModule } from '@nestjs/testing';
import {UsersGrpcController} from '@src-module/users-grpc/src/controller/users-grpc.controller';

describe('UsersGrpcController', () => {
  let controller: UsersGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersGrpcController],
    }).compile();

    controller = module.get<UsersGrpcController>(UsersGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
