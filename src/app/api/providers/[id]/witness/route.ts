// src/app/api/providers/[id]/witness/route.ts
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

// PUT /api/providers/[id]/witness - Update witness details
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists and belongs to user
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - not your provider profile');
    }

    const witnessDetails = await request.json();
    
    // Validate witness details structure
    if (!Array.isArray(witnessDetails)) {
      return createErrorResponse('Witness details must be an array', 400);
    }

    // Basic validation for each witness
    for (const witness of witnessDetails) {
      if (!witness.name || !witness.contactDetails) {
        return createErrorResponse('Each witness must have name and contactDetails', 400);
      }
    }

    const updatedProvider = await ProviderService.updateWitnessDetails(id, witnessDetails);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to update witness details', 500);
    }

    return createSuccessResponse(
      updatedProvider,
      'Witness details updated successfully'
    );
  } catch (error) {
    console.error('Error updating witness details:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update witness details',
      500
    );
  }
}

// GET /api/providers/[id]/witness - Get witness details
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

    // Check if user can access witness details (own profile or public access)
    // For sensitive witness info, you might want to restrict access
    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only view your own witness details');
    }

    return createSuccessResponse({
      providerId: id,
      witnessDetails: provider.witnessDetails || []
    });
  } catch (error) {
    console.error('Error fetching witness details:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch witness details',
      500
    );
  }
}