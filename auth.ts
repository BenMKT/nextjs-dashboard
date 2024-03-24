// Create a separate file for the `bcrypt` package because `bcrypt` relies on Node.js APIs not available in Next.js Middleware
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// Add the Credentials provider which allows users to log in with a username and a password. It's generally recommended to use alternative providers such as `OAuth` or `email` providers
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

//After validating the credentials, create a new getUser function that queries the user from the database thus checking if the user exists in the database
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
// Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // Call `bcrypt.compare` from the `bcrypt` package to compare the password provided by the user with the hashed password stored in the database if they match
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        //  if the passwords match you want to return the user, otherwise, return null to prevent the user from logging in
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
