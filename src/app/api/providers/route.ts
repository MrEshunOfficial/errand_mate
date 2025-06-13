// src/app/api/providers/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/lib/services/providerServices';

// GET /api/providers - Get providers with pagination and filters
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const region = searchParams.get('region') || undefined;
    const city = searchParams.get('city') || undefined;
    const serviceId = searchParams.get('serviceId') || undefined;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const search = searchParams.get('search');

    // If search term is provided, use search functionality
    if (search) {
      const providers = await ProviderService.searchProviders(search);
      return createSuccessResponse({
        providers,
        totalProviders: providers.length,
        currentPage: 1,
        totalPages: 1
      });
    }

    // Build filters object
    const filters = {
      ...(region && { region }),
      ...(city && { city }),
      ...(serviceId && { serviceId }),
      ...(minRating && { minRating })
    };

    const result = await ProviderService.getProvidersWithPagination(
      page,
      limit,
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return createSuccessResponse(result);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch providers',
      500
    );
  }
}

// POST /api/providers - Create new provider
export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    const providerData = await request.json();
    
    // Ensure the provider is created for the authenticated user
    const createData = {
      ...providerData,
      userId: user.userId
    };

    const newProvider = await ProviderService.createProvider(createData);
    
    return createSuccessResponse(newProvider, 'Provider created successfully', 201);
  } catch (error) {
    console.error('Error creating provider:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to create provider',
      500
    );
  }
}