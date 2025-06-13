// src/app/api/providers/location/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/lib/services/providerServices';

// GET /api/providers/location - Get providers by location
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || undefined;
    const city = searchParams.get('city') || undefined;
    const district = searchParams.get('district') || undefined;

    // At least one location parameter must be provided
    if (!region && !city && !district) {
      return createErrorResponse('At least one location parameter (region, city, or district) must be provided', 400);
    }

    const providers = await ProviderService.getProvidersByLocation(region, city, district);
    
    return createSuccessResponse({
      providers,
      total: providers.length,
      filters: {
        region,
        city,
        district
      }
    });
  } catch (error) {
    console.error('Error fetching providers by location:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch providers by location',
      500
    );
  }
}