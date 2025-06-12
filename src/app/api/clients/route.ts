// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getAuthenticatedUser, 
  createAuthErrorResponse, 
  createErrorResponse, 
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ClientServices } from '@/lib/services/clientService';

// GET /api/clients - Get all clients (admin only) or search clients
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const region = searchParams.get('region');
    const city = searchParams.get('city');
    const district = searchParams.get('district');

    const result = await ClientServices.getAllClients({
      page,
      limit,
      search: search || undefined,
      region: region || undefined,
      city: city || undefined,
      district: district || undefined
    });

    return createSuccessResponse(result);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch clients',
      500
    );
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    const body = await request.json();
    
    // Ensure the client is associated with the authenticated user
    const clientData = {
  ...body,
  userId: String(user.userId)
};


    const newClient = await ClientServices.createClient(clientData);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to create client',
      500
    );
  }
}
