// src/app/api/providers/user/[userId]/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/lib/services/providerServices';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ userId: string }>;
}

// GET /api/providers/user/[userId] - Get provider by userId
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { userId } = await context.params;
    
    // Check if user is accessing their own profile or has permission
    if (userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only access your own provider profile');
    }

    const provider = await ProviderService.getProviderByUserId(userId);
    
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    return createSuccessResponse(provider);
  } catch (error) {
    console.error('Error fetching provider by userId:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider',
      500
    );
  }
}