import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {RolesEnum} from '@src-module/http-auth/src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly _reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const classRoles = this._reflector.get<RolesEnum[]>('roles', context.getClass());
    const handlerRoles = this._reflector.get<RolesEnum[]>('roles', context.getHandler());
    const roles = classRoles || handlerRoles;
    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    return roles.indexOf(request.user.role) !== -1;
  }
}
