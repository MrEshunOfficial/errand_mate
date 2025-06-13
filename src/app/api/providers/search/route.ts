// src/app/api/providers/search/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/lib/services/providerServices';

// GET /api/providers/search - Search providers by name or email
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return createErrorResponse('Search query parameter "q" is required', 400);
    }

    if (query.trim().length < 2) {
      return createErrorResponse('Search query must be at least 2 characters long', 400);
    }

    const providers = await ProviderService.searchProviders(query.trim());
    
    return createSuccessResponse({
      providers,
      total: providers.length,
      query: query.trim()
    });
  } catch (error) {
    console.error('Error searching providers:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to search providers',
      500
    );
  }
}