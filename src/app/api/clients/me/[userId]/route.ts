// src/app/api/clients/me/route.ts
import { 
  getAuthenticatedUser, 
  createAuthErrorResponse, 
  createErrorResponse, 
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ClientServices } from '@/lib/services/clientService';

// GET /api/clients/me - Get current user's client profile
export async function GET() {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    const client = await ClientServices.getClientByUserId(user.userId);
    
    if (!client) {
      return createErrorResponse('Client profile not found', 404);
    }

    return createSuccessResponse(client);
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch client profile',
      500
    );
  }
}