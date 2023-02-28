import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core';

@Injectable()
export class FakeAuthGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const classDisableCheckAuth = this._reflector.get<string[]>('disableCheckAuth', context.getClass());
    const handlerDisableCheckAuth = this._reflector.get<string[]>('disableCheckAuth', context.getHandler());
    const disableCheckAuth = classDisableCheckAuth || handlerDisableCheckAuth;
    if (disableCheckAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userId = request.headers['x-fake-user-id'];
    const role = request.headers['x-fake-role'];

    if (userId && role) {
      request.user = {
        userId,
        role,
      };

      return true;
    }

    throw new UnauthorizedException();
  }
}
