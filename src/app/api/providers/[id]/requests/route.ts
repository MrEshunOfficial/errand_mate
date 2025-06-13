// src/app/api/providers/[id]/requests/route.ts
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

// POST /api/providers/[id]/requests - Add service request to provider
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

    const serviceRequestData = await request.json();
    
    // Add client information to the request
    const requestData = {
      ...serviceRequestData,
      clientId: user.userId,
      requestDate: new Date(),
      status: 'pending' as const
    };

    const updatedProvider = await ProviderService.addServiceRequest(id, requestData);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to add service request', 500);
    }

    return createSuccessResponse(
      updatedProvider, 
      'Service request added successfully', 
      201
    );
  } catch (error) {
    console.error('Error adding service request:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to add service request',
      500
    );
  }
}

// src/app/api/providers/[id]/requests/[requestId]/route.ts
// Type definition for nested route
interface RequestRouteContext {
  params: Promise<{ id: string; requestId: string }>;
}

// PUT /api/providers/[id]/requests/[requestId] - Update service request status
export async function PUT(request: NextRequest, context: RequestRouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id, requestId } = await context.params;
    
    // Verify provider exists and belongs to user
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - not your provider profile');
    }

    const { status } = await request.json();
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return createErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updatedProvider = await ProviderService.updateServiceRequestStatus(
      id,
      requestId,
      status
    );
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to update service request status', 500);
    }

    return createSuccessResponse(
      updatedProvider,
      'Service request status updated successfully'
    );
  } catch (error) {
    console.error('Error updating service request status:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update service request status',
      500
    );
  }
}