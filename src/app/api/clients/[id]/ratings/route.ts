// src/app/api/clients/[id]/ratings/route.ts
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
  params: Promise<{ id: string }>;
}

// POST /api/clients/[id]/ratings - Add service provider rating
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;

    // Verify the client belongs to the authenticated user
    const client = await ClientServices.getClientById(id);
    if (!client) {
      return createErrorResponse('Client not found', 404);
    }

    if (client.userId !== user.userId) {
      return createAuthErrorResponse('Access denied');
    }

    const ratingData = await request.json();
    const updatedClient = await ClientServices.addServiceProviderRating(id, ratingData);

    return createSuccessResponse(updatedClient);
  } catch (error) {
    console.error('Error adding service provider rating:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to add service provider rating',
      500
    );
  }
}