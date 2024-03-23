// created a separate file for the bcrypt package because bcrypt relies on Node.js APIs not available in Next.js Middleware

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
