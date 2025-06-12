// src/lib/auth-utils.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import your auth configuration

// Types
interface AuthenticatedUser {
  userId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

interface ErrorWithStatus extends Error {
  status?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to validate authenticated user
export async function validateAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    const error = new Error('Not authenticated') as ErrorWithStatus;
    error.status = 401;
    throw error;
  }
  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image
  };
}

// Alternative function that returns null instead of throwing
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.email || !session?.user?.id) {
      return null;
    }
    
    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

// Helper function to handle errors consistently
export function handleError(error: ErrorWithStatus) {
  console.error('Operation error:', error);
  return NextResponse.json(
    {
      success: false,
      message: error.message || 'An error occurred during the operation'
    },
    { status: error.status || 500 }
  );
}

// Helper function to create error responses
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { 
      success: false,
      error: message 
    },
    { status }
  );
}

// Helper function to create success responses
export function createSuccessResponse<T>(data: T, message?: string, status: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  
  if (message) {
    response.message = message;
  }
  
  return NextResponse.json(response, { status });
}

// Helper function to create auth error response
export function createAuthErrorResponse(message: string = "Not authenticated") {
  return NextResponse.json(
    { 
      success: false,
      error: message 
    },
    { status: 401 }
  );
}

// Middleware-style auth check that can be used in API routes
export async function withAuth<T extends unknown[]>(
  handler: (user: AuthenticatedUser, ...args: T) => Promise<NextResponse>,
  ...args: T
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      const error = new Error('Not authenticated') as ErrorWithStatus;
      error.status = 401;
      throw error;
    }
    
    const user: AuthenticatedUser = {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image
    };
    
    return await handler(user, ...args);
  } catch (error) {
    return handleError(error as ErrorWithStatus);
  }
}