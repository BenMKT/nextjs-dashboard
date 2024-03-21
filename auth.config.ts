import type { NextAuthConfig } from "next-auth";
// The below object will contain the configuration options for NextAuth.js.
export const authConfig = {
    // specify the route for custom sign-in into your pages option so that the user will be redirected to your custom login page rather than the NextAuth.js default page
    pages: {
        signIn: '/login',
    },
};
