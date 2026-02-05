declare module 'next-auth/jwt' {
  import type { NextRequest } from 'next/server';
  import type { JWT } from 'next-auth/jwt';

  export function getToken(params: { req: NextRequest; secret?: string }): Promise<JWT | null>;
}
