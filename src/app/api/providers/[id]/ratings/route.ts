// src/app/api/providers/[id]/ratings/route.ts
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

// POST /api/providers/[id]/ratings - Add client rating to provider
export async function POST(request: NextRequest, context: RouteContext) {
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

    // Prevent providers from rating themselves
    if (provider.userId === user.userId) {
      return createErrorResponse('Cannot rate your own provider profile', 400);
    }

    const ratingData = await request.json();
    
    // Validate rating
    if (!ratingData.rating || ratingData.rating < 1 || ratingData.rating > 5) {
      return createErrorResponse('Rating must be between 1 and 5', 400);
    }

    const rating = {
      ...ratingData,
      clientId: user.userId,
      ratingDate: new Date()
    };

    const updatedProvider = await ProviderService.addClientRating(id, rating);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to add rating', 500);
    }

    // Get updated average rating
    const averageRating = await ProviderService.getProviderAverageRating(id);

    return createSuccessResponse(
      {
        provider: updatedProvider,
        averageRating
      },
      'Rating added successfully',
      201
    );
  } catch (error) {
    console.error('Error adding rating:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to add rating',
      500
    );
  }
}

// GET /api/providers/[id]/ratings - Get provider's average rating
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

    const averageRating = await ProviderService.getProviderAverageRating(id);
    
    return createSuccessResponse({
      providerId: id,
      averageRating,
      totalRatings: provider.clientRating?.length || 0
    });
  } catch (error) {
    console.error('Error fetching provider rating:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider rating',
      500
    );
  }
}