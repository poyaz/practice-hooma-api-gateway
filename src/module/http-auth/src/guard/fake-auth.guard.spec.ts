import {FakeAuthGuard} from './fake-auth.guard';
import {Test, TestingModule} from '@nestjs/testing';
import {mock, MockProxy} from 'jest-mock-extended';
import {ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {HttpArgumentsHost} from '@nestjs/common/interfaces';
import {Reflector} from '@nestjs/core';

describe('FakeAuthGuard', () => {
  let fakeAuthGuard: FakeAuthGuard;
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
          provide: FakeAuthGuard,
          inject: [reflectorProvider],
          useFactory: (reflector: Reflector) =>  new FakeAuthGuard(reflector),
        },
      ],
    }).compile();

    fakeAuthGuard = module.get<FakeAuthGuard>(FakeAuthGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(fakeAuthGuard).toBeDefined();
  });

  describe(`canActive`, () => {
    let disableCheckAuthDecoratorName: string;
    let context: MockProxy<ExecutionContext>;
    let contextSwitchToHttp: MockProxy<HttpArgumentsHost>;
    let contextGetClass: string;
    let contextGetHandler: string;

    beforeEach(() => {
      disableCheckAuthDecoratorName = 'disableCheckAuth';
      context = mock<ExecutionContext>();
      contextSwitchToHttp = mock<HttpArgumentsHost>();

      context.switchToHttp.mockReturnValue(contextSwitchToHttp);

      contextGetClass = 'class';
      contextGetHandler = 'handler';
    });

    it(`Should successfully return true when is enable ignore check auth decorator on class`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(undefined);

      const result = fakeAuthGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, disableCheckAuthDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, disableCheckAuthDecoratorName, contextGetHandler);
      expect(result).toBeTruthy();
    });

    it(`Should successfully can active when fake userId and role exist in headers`, () => {
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        headers: {
          'x-fake-user-id': 'id',
          'x-fake-role': 'role',
        }
      });

      const result = fakeAuthGuard.canActivate(context);

      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it(`Should error can active when fake userId not exist in headers`, () => {
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        headers: {
          'x-fake-role': 'role',
        }
      });

      let result;
      let error;

      try {
        result = fakeAuthGuard.canActivate(context);
      } catch (e) {
        error = e;
      }

      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it(`Should error can active when fake role not exist in headers`, () => {
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        headers: {
          'x-fake-user-id': 'id',
        }
      });

      let result;
      let error;

      try {
        result = fakeAuthGuard.canActivate(context);
      } catch (e) {
        error = e;
      }

      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it(`Should error can active when fake userId and role not exist in headers`, () => {
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        headers: {}
      });

      let result;
      let error;

      try {
        result = fakeAuthGuard.canActivate(context);
      } catch (e) {
        error = e;
      }

      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(error).toBeInstanceOf(UnauthorizedException);
    });
  })
});
