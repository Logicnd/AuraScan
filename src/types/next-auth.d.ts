declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      bits: number;
      tag: string;
      userNumber?: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    username?: string;
    email?: string | null;
    role?: string;
    bits?: number;
    tag?: string;
    userNumber?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    bits?: number;
    tag?: string;
    username?: string;
    userNumber?: number;
  }
}
