import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    guard = new RolesGuard(reflector);
  });

  it('rejects unauthenticated requests', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([Role.ADMIN]);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: undefined }),
      }),
      getHandler: () => ({}),
      getClass: () => class TestController {},
    } as any;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects requests when the required role is missing', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockImplementationOnce(() => [Role.ADMIN])
      .mockImplementationOnce(() => undefined);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: Role.CUSTOMER, permissions: [Permission.QUOTES_VIEW] } }),
      }),
      getHandler: () => ({}),
      getClass: () => class TestController {},
    } as any;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects requests when a required permission is missing', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => [Permission.POLICIES_ISSUE]);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: Role.OPERATIONS, permissions: [Permission.POLICIES_VIEW] } }),
      }),
      getHandler: () => ({}),
      getClass: () => class TestController {},
    } as any;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows requests when role and permissions are valid', () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockImplementationOnce(() => [Role.ADMIN])
      .mockImplementationOnce(() => [Permission.USERS_MANAGE]);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: Role.ADMIN, permissions: [Permission.USERS_MANAGE] } }),
      }),
      getHandler: () => ({}),
      getClass: () => class TestController {},
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });
});
