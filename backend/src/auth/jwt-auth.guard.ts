import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

function parseCookies(rawCookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!rawCookieHeader) {
    return result;
  }

  for (const part of rawCookieHeader.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = decodeURIComponent(trimmed.slice(idx + 1).trim());
    result[key] = value;
  }

  return result;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const cookieHeader = req.headers?.cookie as string | undefined;
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies.session || cookies.access_token;

    if (!req.headers?.authorization && sessionToken) {
      req.headers.authorization = `Bearer ${sessionToken}`;
    }

    return super.canActivate(context);
  }
}
