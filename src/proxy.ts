import { NextResponse, type NextRequest } from 'next/server';
import {
  getSessionSecret,
  LOGIN_PATH,
  SESSION_COOKIE_NAME,
} from '@/lib/auth/session-config';
import { verifySessionToken } from '@/lib/auth/session-token';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return Boolean(token && verifySessionToken(token, getSessionSecret()));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;
  const hasSession = isAuthenticated(request);

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // API trả lỗi JSON thay vì chuyển hướng, để trình duyệt hiển thị được thông báo và mở trang đăng nhập.
  if (pathname.startsWith('/api/') && !hasSession) {
    return NextResponse.json(
      { error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.' },
      { status: 401 },
    );
  }

  if (!isLoginPage && !hasSession) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('from', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|brand/|images/menu/|images/customer-display/).*)',
  ],
};
