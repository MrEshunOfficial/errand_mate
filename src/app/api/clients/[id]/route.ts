// src/app/api/clients/[id]/route.ts
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

// GET /api/clients/[id] - Get client by ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    const client = await ClientServices.getClientById(id);
    
    if (!client) {
      return createErrorResponse('Client not found', 404);
    }

    // Ensure user can only access their own client data
    if (client.userId !== user.userId) {
      return createAuthErrorResponse('Access denied');
    }

    return createSuccessResponse(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch client',
      500
    );
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;

    // First, verify the client belongs to the authenticated user
    const existingClient = await ClientServices.getClientById(id);
    if (!existingClient) {
      return createErrorResponse('Client not found', 404);
    }

    if (existingClient.userId !== user.userId) {
      return createAuthErrorResponse('Access denied');
    }

    const updateData = await request.json();
    const updatedClient = await ClientServices.updateClient(id, updateData);

    return createSuccessResponse(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update client',
      500
    );
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;

    // First, verify the client belongs to the authenticated user
    const existingClient = await ClientServices.getClientById(id);
    if (!existingClient) {
      return createErrorResponse('Client not found', 404);
    }

    if (existingClient.userId !== user.userId) {
      return createAuthErrorResponse('Access denied');
    }

    const deleted = await ClientServices.deleteClient(id);
    
    if (!deleted) {
      return createErrorResponse('Failed to delete client', 500);
    }

    return createSuccessResponse({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to delete client',
      500
    );
  }
}