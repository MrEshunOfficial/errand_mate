// src/app/api/providers/[id]/stats/route.ts
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
  params: Promise<{ id: string }>;
}

// GET /api/providers/[id]/stats - Get provider's service statistics
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    // Check if user can access stats (own profile or public stats)
    // For sensitive stats, restrict to provider owner only
    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only view your own provider stats');
    }

    const stats = await ProviderService.getProviderStats(id);
    
    return createSuccessResponse({
      providerId: id,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider stats',
      500
    );
  }
}