import { AccessAuthGuard } from './access-auth.guard';
import {Reflector} from '@nestjs/core';
import {mock, MockProxy} from 'jest-mock-extended';
import {Test, TestingModule} from '@nestjs/testing';

describe('AccessAuthGuard', () => {
  let accessAuthGuard: AccessAuthGuard;
  let reflector: MockProxy<Reflector>;

  beforeEach(async () => {
    reflector = mock<Reflector>();

    const reflectorProvider = 'reflector';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: reflectorProvider,
          useValue: reflector,
        },
        {
          provide: AccessAuthGuard,
          inject: [reflectorProvider],
          useFactory: (reflector: Reflector) => new AccessAuthGuard(reflector),
        },
      ],
    }).compile();

    accessAuthGuard = module.get(AccessAuthGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(accessAuthGuard).toBeDefined();
  });
});
