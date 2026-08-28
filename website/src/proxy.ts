import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (host === 'www.khaacho.com' || (host === 'khaacho.com' && forwardedProto === 'http')) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = 'khaacho.com';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};