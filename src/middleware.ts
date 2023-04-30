import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants/routes';

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;

    const isAuth = await getToken({ req });
    const sensitiveRoutes = [ROUTES.dashboard.base];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    switch (pathname) {
      case ROUTES.login: {
        console.log('case login');
        if (isAuth) {
          return NextResponse.redirect(new URL(ROUTES.dashboard.base, req.url));
        }

        return NextResponse.next();
      }
      case ROUTES.home: {
        console.log('case home');
        return NextResponse.redirect(new URL(ROUTES.dashboard.base, req.url));
      }
    }

    if (isAccessingSensitiveRoute && !isAuth) {
      return NextResponse.redirect(new URL(ROUTES.login, req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [ROUTES.home, ROUTES.login, `${ROUTES.dashboard.base}/:path*`],
};
