// src/app/api/clients/search/location/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser, 
  createAuthErrorResponse, 
  createErrorResponse, 
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ClientServices } from '@/lib/services/clientService';

// GET /api/clients/search/location - Search clients by location
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const locality = searchParams.get('locality');

    const clients = await ClientServices.searchClientsByLocation(
      region || undefined,
      city || undefined,
      district || undefined,
      locality || undefined
    );

    return createSuccessResponse(clients);
  } catch (error) {
    console.error('Error searching clients by location:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to search clients by location',
      500
    );
  }
}