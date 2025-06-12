import NextAuth from "next-auth";
import type { NextAuthConfig, Session, DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models/authentication/authModel";
import { connect } from "./lib/dbconfigue/dbConfigue";

// Add a session storage for tracking active sessions
const activeSessions = new Map<string, { userId: string; createdAt: Date }>();

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role: string;
      email?: string | null;
      name?: string | null;
      provider?: string | null;
      providerId?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    } & DefaultSession["user"];
    sessionId?: string;
  }

  interface User {
    id?: string;
    role: string;
    email?: string | null;
    name?: string | null;
    provider?: string | null;
    providerId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

const publicPaths = ["/", "/user/register", "/user/login"];
const privatePaths: string[] = [
  "/user/dashboard",
  "/user/profile",
  "/user/profile/profile_form",
];

interface CustomToken extends JWT {
  id?: string;
  role?: string;
  provider?: string;
  sessionId?: string;
}

// Function to generate secure session ID
async function generateSessionId(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Function to invalidate all sessions for a user
export async function invalidateUserSessions(userId: string) {
  const sessionsToRemove: string[] = [];
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      sessionsToRemove.push(sessionId);
    }
  }
  
  sessionsToRemove.forEach(sessionId => {
    activeSessions.delete(sessionId);
  });
  
  console.log(`Invalidated ${sessionsToRemove.length} sessions for user ${userId}`);
}

// Function to clean up expired sessions
function cleanupExpiredSessions() {
  const now = new Date();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now.getTime() - session.createdAt.getTime() > maxAge) {
      activeSessions.delete(sessionId);
    }
  }
}

export const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour
  },
  pages: {
    signIn: "/user/login",
    signOut: "/user/login",
    error: "/user/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          await connect();

          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) {
            throw new Error("User not found");
          }

          if (
            user.provider &&
            user.providerId &&
            user.provider !== "credentials"
          ) {
            throw new Error(
              `This account uses ${user.provider} authentication. Please sign in with ${user.provider}.`
            );
          }

          const isPasswordValid = await user.comparePassword(
            credentials.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            provider: user.provider,
            providerId: user.providerId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Clean up expired sessions periodically
      cleanupExpiredSessions();
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider;

        // Generate new session ID for new logins
        const sessionId = await generateSessionId();
        token.sessionId = sessionId;
        
        // Track active session
        activeSessions.set(sessionId, {
          userId: user.id as string,
          createdAt: new Date(),
        });
      }
      
      // Validate existing session
      if (token.sessionId && !activeSessions.has(token.sessionId as string)) {
        // Session has been invalidated, return null to force logout
        return {};
      }
      
      return token;
    },

    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Check if session is still valid
      if (isLoggedIn && auth.sessionId && !activeSessions.has(auth.sessionId)) {
        // Session has been invalidated, redirect to login
        return Response.redirect(new URL("/user/login", nextUrl));
      }

      // Handle public paths (login, register, etc.)
      if (publicPaths.some((p) => path.startsWith(p))) {
        if (
          isLoggedIn &&
          (path.startsWith("/user/login") || path.startsWith("/user/register"))
        ) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Handle private paths - IMPORTANT: This check must come before the root path check
      if (privatePaths.some((p) => path.startsWith(p))) {
        if (!isLoggedIn) {
          const callbackUrl = encodeURIComponent(path);
          return Response.redirect(new URL(`/user/login?callbackUrl=${callbackUrl}`, nextUrl));
        }
        return isLoggedIn;
      }

      // Handle root path
      if (path === "/") {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/user/login", nextUrl));
        }
        return true;
      }

      // Default behavior for unspecified routes
      return true;
    },

    async signIn({ user, account }) {
      if (!user?.email) return false;

      try {
        await connect();
        
        // Clean up expired sessions
        cleanupExpiredSessions();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          if (account) {
            dbUser = await User.create({
              email: user.email,
              name: user.name,
              provider: account.provider,
              providerId: account.providerAccountId,
            });
          } else {
            return false;
          }
        }

        if (account) {
          if (
            dbUser.provider &&
            dbUser.provider !== account.provider &&
            dbUser.provider !== "credentials"
          ) {
            return false;
          }
          dbUser.providerId = account.providerAccountId;
          dbUser.provider = account.provider;
          await dbUser.save();
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.provider = dbUser.provider;
        user.providerId = dbUser.providerId;
        user.createdAt = dbUser.createdAt;
        user.updatedAt = dbUser.updatedAt;

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: CustomToken;
    }): Promise<Session> {
      if (!token.email && !token.sub) {
        return session;
      }

      // Check if session is still valid
      if (token.sessionId && !activeSessions.has(token.sessionId)) {
        // Session has been invalidated, return empty session
        return {} as Session;
      }

      try {
        const user = await User.findById(token.id);

        if (user && session.user) {
          session.user.id = user._id.toString();
          session.user.role = user.role;
          session.user.email = user.email;
          session.user.name = user.name;
          session.user.provider = user.provider;
          session.user.providerId = user.providerId;
          session.user.createdAt = user.createdAt;
          session.user.updatedAt = user.updatedAt;
          session.sessionId = token.sessionId;
        }

        return session;
      } catch (error) {
        console.error("Error fetching user data for session:", error);
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.sessionId = token.sessionId;
        }
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      // Handle logout redirects - clear session immediately
      if (url.includes("signOut") || url.includes("logout")) {
        return `${baseUrl}/user/login`;
      }

      if (url.startsWith("/api/auth/callback/google")) {
        return `${baseUrl}/`;
      }

      if (url.startsWith("/api/auth/callback")) {
        return `${baseUrl}/`;
      }

      // Check if there's a callbackUrl parameter
      try {
        const parsedUrl = new URL(url);
        const callbackUrl = parsedUrl.searchParams.get("callbackUrl");
        if (callbackUrl) {
          if (callbackUrl.startsWith("/")) {
            return `${baseUrl}${callbackUrl}`;
          } else if (callbackUrl.startsWith(baseUrl)) {
            return callbackUrl;
          }
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
      }

      // Handle relative URLs
      if (url.startsWith("/")) {
        if (url === "/") {
          return `${baseUrl}/`;
        }
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default fallback
      return `${baseUrl}/`;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);