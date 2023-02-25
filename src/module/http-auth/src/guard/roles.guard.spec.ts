import {Test, TestingModule} from '@nestjs/testing';
import {mock, MockProxy} from 'jest-mock-extended';
import {RolesGuard} from './roles.guard';
import {ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {HttpArgumentsHost} from '@nestjs/common/interfaces';
import {Reflector} from '@nestjs/core';
import {RolesEnum} from '@src-module/http-auth/src/enum/roles.enum';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
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
          provide: RolesGuard,
          inject: [reflectorProvider],
          useFactory: (reflector: Reflector) => new RolesGuard(reflector),
        },
      ],
    }).compile();

    rolesGuard = module.get(RolesGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe(`canActive`, () => {
    let rolesDecoratorName: string;
    let context: MockProxy<ExecutionContext>;
    let contextSwitchToHttp: MockProxy<HttpArgumentsHost>;
    let contextGetClass: string;
    let contextGetHandler: string;

    beforeEach(() => {
      rolesDecoratorName = 'roles';
      context = mock<ExecutionContext>();
      contextSwitchToHttp = mock<HttpArgumentsHost>();

      context.switchToHttp.mockReturnValue(contextSwitchToHttp);

      contextGetClass = 'class';
      contextGetHandler = 'handler';
    });

    it(`Should successfully return false when not found any class and handler roles decorator`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get).mockReturnValue(undefined);

      const result = rolesGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, rolesDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, rolesDecoratorName, contextGetHandler);
      expect(result).toBeFalsy();
    });

    it(`Should successfully return false when token role property not found in roles decorator list`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get)
        .mockReturnValueOnce([RolesEnum.ADMIN])
        .mockReturnValueOnce(undefined);
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        user: {
          role: undefined,
        },
      });

      const result = rolesGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, rolesDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, rolesDecoratorName, contextGetHandler);
      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeFalsy();
    });

    it(`Should successfully return true when token role property is equal admin`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get)
        .mockReturnValueOnce([RolesEnum.ADMIN])
        .mockReturnValueOnce(undefined);
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        user: {
          role: RolesEnum.ADMIN,
        },
      });

      const result = rolesGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, rolesDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, rolesDecoratorName, contextGetHandler);
      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it(`Should successfully return false when token role property is equal user`, () => {
      (<jest.Mock>context.getClass).mockReturnValue(contextGetClass);
      (<jest.Mock>context.getHandler).mockReturnValue(contextGetHandler);
      (<jest.Mock>reflector.get)
        .mockReturnValueOnce([RolesEnum.USER])
        .mockReturnValueOnce(undefined);
      (<jest.Mock>contextSwitchToHttp.getRequest).mockReturnValue({
        user: {
          role: RolesEnum.USER,
        },
      });

      const result = rolesGuard.canActivate(context);

      expect(context.getClass).toHaveBeenCalled();
      expect(context.getHandler).toHaveBeenCalled();
      expect(reflector.get).toHaveBeenCalledTimes(2);
      expect(reflector.get).toHaveBeenNthCalledWith(1, rolesDecoratorName, contextGetClass);
      expect(reflector.get).toHaveBeenNthCalledWith(2, rolesDecoratorName, contextGetHandler);
      expect(context.switchToHttp).toHaveBeenCalled();
      expect(contextSwitchToHttp.getRequest).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });
  });
});
