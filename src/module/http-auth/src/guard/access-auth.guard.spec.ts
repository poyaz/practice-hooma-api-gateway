import {Reflector} from '@nestjs/core';
import {mock, MockProxy} from 'jest-mock-extended';
import {Test, TestingModule} from '@nestjs/testing';
import {ExecutionContext} from '@nestjs/common';

let authGuardCanActivate = jest.fn();
jest.mock('@nestjs/passport', () => {
  return {
    AuthGuard: function () {
      const fn = jest.fn();
      fn.prototype.canActivate = authGuardCanActivate;

      return fn;
    },
  };
});

import { AccessAuthGuard } from './access-auth.guard';


describe('AccessAuthGuard', () => {
  let accessAuthGuard: AccessAuthGuard;
  let reflector: MockProxy<Reflector>;

  beforeEach(async () => {
    const reflectorProvider = 'reflector';
    reflector = mock<Reflector>();

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

    accessAuthGuard = module.get<AccessAuthGuard>(AccessAuthGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    authGuardCanActivate.mockClear();
  });

  it('should be defined', () => {
    expect(accessAuthGuard).toBeDefined();
  });

  describe(`canActivate`, () => {
    let disableCheckAuthDecoratorName: string;
    let context: MockProxy<ExecutionContext>;
    let contextGetClass: string;
    let contextGetHandler: string;

    beforeEach(() => {
      disableCheckAuthDecoratorName = 'disableCheckAuth';
      context = mock<ExecutionContext>();

      contextGetClass = 'class';
      contextGetHandler = 'handler';
    });

    it(`Should successfully return true when is enable ignore check auth decorator on class`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(undefined);

      const result = accessAuthGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, disableCheckAuthDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, disableCheckAuthDecoratorName, contextGetHandler);
      expect(result).toBeTruthy();
    });

    it(`Should successfully return true when is disable ignore check auth decorator on class`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get).mockReturnValue(undefined);
      authGuardCanActivate.mockReturnValue(true);

      const result = accessAuthGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, disableCheckAuthDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, disableCheckAuthDecoratorName, contextGetHandler);
      expect(authGuardCanActivate).toHaveBeenCalled();
      expect(authGuardCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBeTruthy();
    });

    it(`Should successfully return true when is disable ignore check auth decorator on class`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get).mockReturnValue(undefined);
      authGuardCanActivate.mockReturnValue(false);

      const result = accessAuthGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, disableCheckAuthDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, disableCheckAuthDecoratorName, contextGetHandler);
      expect(authGuardCanActivate).toHaveBeenCalled();
      expect(authGuardCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBeFalsy();
    });
  });
});
