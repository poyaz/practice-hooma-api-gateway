import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {RolesEnum} from '@src-module/http-auth/src/enum/roles.enum';
import {Reflector} from '@nestjs/core';
import {UsersRoleEnum} from '@src-module/users-grpc/src/controller/enum/users-role.enum';

@Injectable()
export class PropertyAccessGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const classUserPropertyAccess = this._reflector.get<Array<string>>('propertyAccess', context.getClass());
    const handlerUserPropertyAccess = this._reflector.get<Array<string>>('propertyAccess', context.getHandler());
    const propertyAccess = classUserPropertyAccess || handlerUserPropertyAccess;
    if (!propertyAccess) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (request.user.role === UsersRoleEnum.ADMIN) {
      return true;
    }

    if (request.headers['content-type']) {
      if (!request.body) {
        return true;
      }

      const keys = Object.keys(request.body);
      for (const key of keys) {
        if (propertyAccess.indexOf(key) !== -1) {
          return false;
        }
      }
    }

    return true;
  }
}
