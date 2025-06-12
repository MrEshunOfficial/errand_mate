// src/app/api/clients/[id]/stats/route.ts
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

// GET /api/clients/[id]/stats - Get client statistics
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

    const stats = await ClientServices.getClientStats(id);
    return createSuccessResponse(stats);
  } catch (error) {
    console.error('Error fetching client statistics:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch client statistics',
      500
    );
  }
}