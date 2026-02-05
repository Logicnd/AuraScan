/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// Type narrowing for Next.js route handler
const handler = NextAuth(authOptions as any) as any;

export { handler as GET, handler as POST };
