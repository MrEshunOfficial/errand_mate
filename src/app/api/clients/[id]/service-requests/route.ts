// src/app/api/clients/[id]/service-requests/route.ts
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

// GET /api/clients/[id]/service-requests - Get client's service request history
export async function GET(request: NextRequest, context: RouteContext) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await ClientServices.getServiceRequestHistory(id, {
      status: status || undefined,
      page,
      limit
    });

    return createSuccessResponse(result);
  } catch (error) {
    console.error('Error fetching service request history:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch service request history',
      500
    );
  }
}

// POST /api/clients/[id]/service-requests - Add new service request
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

    const serviceRequestData = await request.json();
    const updatedClient = await ClientServices.addServiceRequest(id, serviceRequestData);

    return createSuccessResponse(updatedClient);
  } catch (error) {
    console.error('Error adding service request:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to add service request',
      500
    );
  }
}