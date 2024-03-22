import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// The below `NextAuth` function is called with `authConfig` as an argument and exports the resulting objects `auth` property. This function is used to configure NextAuth for your application.
export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

    // A matcher is an array of strings that define the routes where the exported middleware should be applied. The string inside the array is a regular expression that matches any route except those that start with `/api`, `/_next/static`, `/_next/image`, or end with `.png`. This is likely used to exclude API routes, static files, images, and PNG files from the middleware.
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// The advantage of employing Middleware for route protection is that the protected routes will not even start rendering until the Middleware verifies the authentication, enhancing both the security and performance of your application.