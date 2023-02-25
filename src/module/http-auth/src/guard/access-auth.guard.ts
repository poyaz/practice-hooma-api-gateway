import {Injectable, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class AccessAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly _reflector: Reflector) {
    super(_reflector);
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

    return super.canActivate(context);
  }
}
