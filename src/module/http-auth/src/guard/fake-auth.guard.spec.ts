import {FakeAuthGuard} from './fake-auth.guard';
import {Test, TestingModule} from '@nestjs/testing';
import {mock, MockProxy} from 'jest-mock-extended';
import {ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {HttpArgumentsHost} from '@nestjs/common/interfaces';

describe('FakeAuthGuard', () => {
  let fakeAuthGuard: FakeAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FakeAuthGuard,
          inject: [],
          useFactory: () => new FakeAuthGuard(),
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
    let context: MockProxy<ExecutionContext>;
    let contextSwitchToHttp: MockProxy<HttpArgumentsHost>;

    beforeEach(() => {
      context = mock<ExecutionContext>();
      contextSwitchToHttp = mock<HttpArgumentsHost>();

      context.switchToHttp.mockReturnValue(contextSwitchToHttp);
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
