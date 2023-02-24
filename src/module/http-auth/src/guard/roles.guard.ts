import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {RolesEnum} from '@src-module/http-auth/src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly _MODIFICATION_METHOD = ['POST', 'PUT', 'PATCH', 'DELETE'];

  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const classRoles = this.reflector.get<RolesEnum[]>('roles', context.getClass());
    const handlerRoles = this.reflector.get<RolesEnum[]>('roles', context.getHandler());
    const roles = classRoles || handlerRoles;
    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    if (roles.indexOf(request.user.role) === -1) {
      return false;
    }

    if (request.user.role === RolesEnum.ADMIN) {
      return true;
    }

    return request.params['userId'] === request.user.userId;
  }
}
