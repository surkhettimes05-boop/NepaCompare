import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, Permission } from '@prisma/client';
import { ROLES_KEY, PERMISSIONS_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const roleMatches = !requiredRoles || requiredRoles.some((role) => user.role === role || user.roles?.includes(role));
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    const permissionMatches = !requiredPermissions || requiredPermissions.every((permission) => permissions.includes(permission));

    if (!roleMatches || !permissionMatches) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
