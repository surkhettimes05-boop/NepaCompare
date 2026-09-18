import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Permission, Role } from '@prisma/client';
import { ROLE_PERMISSIONS } from './role-permissions';
import { getJwtSecret } from './jwt-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  private async resolvePermissions(role: Role): Promise<Permission[]> {
    const permissions = ROLE_PERMISSIONS[role] ?? [];
    const dbPermissions = await this.prisma.rolePermission.findMany({
      where: { role },
      select: { permission: true },
    });

    return Array.from(new Set([
      ...permissions,
      ...dbPermissions.map((entry) => entry.permission),
    ]));
  }

  async validate(payload: any) {
    const requestedRole = payload.role as Role;

    if (requestedRole === Role.CUSTOMER) {
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('Invalid session');

      return {
        userId: payload.sub,
        email: payload.email,
        phone: payload.phone,
        role: Role.CUSTOMER,
        roles: [Role.CUSTOMER],
        permissions: await this.resolvePermissions(Role.CUSTOMER),
      };
    }

    const staff = await this.prisma.staff.findUnique({ where: { id: payload.sub } });
    if (!staff || !staff.active) throw new UnauthorizedException('Invalid session');

    const permissions = await this.resolvePermissions(staff.role as Role);

    return {
      userId: payload.sub,
      phone: payload.phone,
      role: staff.role,
      roles: [staff.role],
      permissions,
    };
  }
}
