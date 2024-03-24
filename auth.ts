// Create a separate file for the `bcrypt` package because `bcrypt` relies on Node.js APIs not available in Next.js Middleware

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// Add the Credentials provider which allows users to log in with a username and a password. It's generally recommended to use alternative providers such as `OAuth` or `email` providers
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig, providers: [Credentials({})],
});
