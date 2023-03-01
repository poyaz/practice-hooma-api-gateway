import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {RolesEnum} from '@src-module/http-auth/src/enum/roles.enum';
import {Reflector} from '@nestjs/core';
import {UsersRoleEnum} from '@src-module/users-grpc/src/controller/enum/users-role.enum';

@Injectable()
export class OwnUserAccessGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const classUserOwnAccess = this._reflector.get<string>('userOwnAccess', context.getClass());
    const handlerUserOwnAccess = this._reflector.get<string>('userOwnAccess', context.getHandler());
    const userOwnAccess = classUserOwnAccess || handlerUserOwnAccess;
    if (!userOwnAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (request.user.role === UsersRoleEnum.ADMIN) {
      return true;
    }

    if ('userId' in request.params) {
      return request.params['userId'] === request.user.userId;
    }

    return true;
  }
}
