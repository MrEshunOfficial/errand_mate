// src/app/api/clients/[id]/service-requests/[requestId]/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ClientServices } from '@/lib/services/clientService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ id: string; requestId: string }>;
}

// PUT /api/clients/[id]/service-requests/[requestId] - Update service request status
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id, requestId } = await context.params;

    // Verify the client belongs to the authenticated user
    const client = await ClientServices.getClientById(id);
    if (!client) {
      return createErrorResponse('Client not found', 404);
    }

    if (client.userId !== user.userId) {
      return createAuthErrorResponse('Access denied');
    }

    const { status } = await request.json();
    const updatedClient = await ClientServices.updateServiceRequestStatus(
      id,
      requestId,
      status
    );

    return createSuccessResponse(updatedClient);
  } catch (error) {
    console.error('Error updating service request status:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update service request status',
      500
    );
  }
}