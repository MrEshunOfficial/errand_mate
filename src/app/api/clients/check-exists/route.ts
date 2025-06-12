// src/app/api/clients/check-exists/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser, 
  createAuthErrorResponse, 
  createErrorResponse, 
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ClientServices } from '@/lib/services/clientService';

// POST /api/clients/check-exists - Check if client exists
export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    const { userId, email } = await request.json();
    const exists = await ClientServices.checkClientExists(userId, email);

    return createSuccessResponse({ exists });
  } catch (error) {
    console.error('Error checking client existence:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to check client existence',
      500
    );
  }
}