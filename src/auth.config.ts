// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

const publicPaths = ['/', '/user/register', '/user/login'];
const privatePaths: string[] = ['/user/profile', '/user/profile/profile_form'];

declare module 'next-auth' {
  interface Session {
    sessionId?: string;
  }
  interface JWT {
    sessionId?: string;
  }
}

async function generateSessionId(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const authConfig = {
  pages: {
    signIn: '/user/login',
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Handle private paths - require authentication
      if (privatePaths.some(p => path.startsWith(p))) {
        if (!isLoggedIn) {
          // Store the intended destination
          const callbackUrl = encodeURIComponent(path);
          return Response.redirect(new URL(`/user/login?callbackUrl=${callbackUrl}`, nextUrl));
        }
        return true;
      }

      // Handle public paths
      if (publicPaths.some(p => path.startsWith(p))) {
        // Redirect authenticated users away from auth pages
        if (isLoggedIn && (path.startsWith('/user/login') || path.startsWith('/user/register'))) {
          return Response.redirect(new URL('/user/profile', nextUrl));
        }
        return true;
      }

      // Handle root path
      if (path === '/') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/user/profile', nextUrl));
        }
        return Response.redirect(new URL('/user/login', nextUrl));
      }

      return !privatePaths.some(p => path.startsWith(p));
    },
    async jwt({ token, user }) {
      if (user) {
        token.sessionId = await generateSessionId();
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sessionId && typeof token.sessionId === 'string') {
        session.sessionId = token.sessionId;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;