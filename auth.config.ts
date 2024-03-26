import type { NextAuthConfig } from "next-auth";
// The below object will contain the configuration options for NextAuth.js.
export const authConfig = {
  // specify the route for custom sign-in into your pages option so that the user will be redirected to your custom login page rather than the NextAuth.js default page
  pages: {
    signIn: '/login',
  },
  // Add the logic to protect your routes. This will prevent users from accessing the dashboard pages unless they are logged in
  callbacks: {
    // The below `authorized` callback is used to verify if the request is authorized to access a page via Next.js Middleware.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true; // if none of the previous conditions are met, the function returns true, allowing the request to proceed thus case for unauthenticated users accessing pages that don't require authentication
    },
  },
  providers: [], // This property is an array that should contain configurations for different login options thus authentication providers (like Google, GitHub, etc.)
} satisfies NextAuthConfig;
