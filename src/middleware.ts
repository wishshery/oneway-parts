import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes require ADMIN role
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public pages
        const { pathname } = req.nextUrl;
        if (!pathname.startsWith('/admin')) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
