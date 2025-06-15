// src/app/api/providers/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

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

// src/app/api/providers/[id]/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/providers/[id] - Get provider by ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    const provider = await ProviderService.getProviderById(id);
    
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    // Check if user can access this provider (own data or public access)
    // For now, allowing access to any provider for public viewing
    // Add authorization logic here if needed
    
    return createSuccessResponse(provider);
  } catch (error) {
    console.error('Error fetching provider:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider',
      500
    );
  }
}

// PUT /api/providers/[id] - Update provider
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // First, verify the provider belongs to the authenticated user
    const existingProvider = await ProviderService.getProviderById(id);
    if (!existingProvider) {
      return createErrorResponse('Provider not found', 404);
    }

    if (existingProvider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - not your provider profile');
    }

    const updateData = await request.json();
    
    // Add the ID to update data
    const updateDataWithId = {
      _id: id,
      ...updateData
    };

    const updatedProvider = await ProviderService.updateProvider(updateDataWithId);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to update provider', 500);
    }

    return createSuccessResponse(updatedProvider, 'Provider updated successfully');
  } catch (error) {
    console.error('Error updating provider:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update provider',
      500
    );
  }
}

// DELETE /api/providers/[id] - Delete provider
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // First, verify the provider belongs to the authenticated user
    const existingProvider = await ProviderService.getProviderById(id);
    if (!existingProvider) {
      return createErrorResponse('Provider not found', 404);
    }

    if (existingProvider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - not your provider profile');
    }

    const deleted = await ProviderService.deleteProvider(id);
    
    if (!deleted) {
      return createErrorResponse('Failed to delete provider', 500);
    }

    return createSuccessResponse({ message: 'Provider deleted successfully' });
  } catch (error) {
    console.error('Error deleting provider:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to delete provider',
      500
    );
  }
}

// src/app/api/providers/user/[userId]/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ userId: string }>;
}

// GET /api/providers/user/[userId] - Get provider by userId
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { userId } = await context.params;
    
    // Check if user is accessing their own profile or has permission
    if (userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only access your own provider profile');
    }

    const provider = await ProviderService.getProviderByUserId(userId);
    
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    return createSuccessResponse(provider);
  } catch (error) {
    console.error('Error fetching provider by userId:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider',
      500
    );
  }
}

// src/app/api/providers/user/[userId]/with-services/route.ts
// GET /api/providers/user/[userId]/with-services - Get provider with populated services
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { userId } = await context.params;
    
    // Check if user is accessing their own profile
    if (userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only access your own provider profile');
    }

    const provider = await ProviderService.getProviderWithServices(userId);
    
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    return createSuccessResponse(provider);
  } catch (error) {
    console.error('Error fetching provider with services:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider with services',
      500
    );
  }
}

// src/app/api/providers/services/[serviceId]/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ serviceId: string }>;
}

// GET /api/providers/services/[serviceId] - Get providers by service
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { serviceId } = await context.params;
    
    const providers = await ProviderService.getProvidersByService(serviceId);
    
    return createSuccessResponse({
      providers,
      total: providers.length,
      serviceId
    });
  } catch (error) {
    console.error('Error fetching providers by service:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch providers by service',
      500
    );
  }
}

// src/app/api/providers/location/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

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

// src/app/api/providers/[id]/requests/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/providers/[id]/requests - Add service request to provider
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    const serviceRequestData = await request.json();
    
    // Add client information to the request
    const requestData = {
      ...serviceRequestData,
      clientId: user.userId,
      requestDate: new Date(),
      status: 'pending' as const
    };

    const updatedProvider = await ProviderService.addServiceRequest(id, requestData);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to add service request', 500);
    }

    return createSuccessResponse(
      updatedProvider, 
      'Service request added successfully', 
      201
    );
  } catch (error) {
    console.error('Error adding service request:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to add service request',
      500
    );
  }
}

// src/app/api/providers/[id]/requests/[requestId]/route.ts
// Type definition for nested route
interface RequestRouteContext {
  params: Promise<{ id: string; requestId: string }>;
}

// PUT /api/providers/[id]/requests/[requestId] - Update service request status
export async function PUT(request: NextRequest, context: RequestRouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id, requestId } = await context.params;
    
    // Verify provider exists and belongs to user
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - not your provider profile');
    }

    const { status } = await request.json();
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return createErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updatedProvider = await ProviderService.updateServiceRequestStatus(
      id,
      requestId,
      status
    );
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to update service request status', 500);
    }

    return createSuccessResponse(
      updatedProvider,
      'Service request status updated successfully'
    );
  } catch (error) {
    console.error('Error updating service request status:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update service request status',
      500
    );
  }
}
// src/app/api/providers/[id]/ratings/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/providers/[id]/ratings - Add client rating to provider
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    // Prevent providers from rating themselves
    if (provider.userId === user.userId) {
      return createErrorResponse('Cannot rate your own provider profile', 400);
    }

    const ratingData = await request.json();
    
    // Validate rating
    if (!ratingData.rating || ratingData.rating < 1 || ratingData.rating > 5) {
      return createErrorResponse('Rating must be between 1 and 5', 400);
    }

    const rating = {
      ...ratingData,
      clientId: user.userId,
      ratingDate: new Date()
    };

    const updatedProvider = await ProviderService.addClientRating(id, rating);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to add rating', 500);
    }

    // Get updated average rating
    const averageRating = await ProviderService.getProviderAverageRating(id);

    return createSuccessResponse(
      {
        provider: updatedProvider,
        averageRating
      },
      'Rating added successfully',
      201
    );
  } catch (error) {
    console.error('Error adding rating:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to add rating',
      500
    );
  }
}

// GET /api/providers/[id]/ratings - Get provider's average rating
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    const averageRating = await ProviderService.getProviderAverageRating(id);
    
    return createSuccessResponse({
      providerId: id,
      averageRating,
      totalRatings: provider.clientRating?.length || 0
    });
  } catch (error) {
    console.error('Error fetching provider rating:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider rating',
      500
    );
  }
}

// src/app/api/providers/[id]/stats/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/providers/[id]/stats - Get provider's service statistics
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    // Check if user can access stats (own profile or public stats)
    // For sensitive stats, restrict to provider owner only
    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only view your own provider stats');
    }

    const stats = await ProviderService.getProviderStats(id);
    
    return createSuccessResponse({
      providerId: id,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch provider stats',
      500
    );
  }
}

// src/app/api/providers/[id]/witness/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/providers/[id]/witness - Update witness details
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists and belongs to user
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - not your provider profile');
    }

    const witnessDetails = await request.json();
    
    // Validate witness details structure
    if (!Array.isArray(witnessDetails)) {
      return createErrorResponse('Witness details must be an array', 400);
    }

    // Basic validation for each witness
    for (const witness of witnessDetails) {
      if (!witness.name || !witness.contactDetails) {
        return createErrorResponse('Each witness must have name and contactDetails', 400);
      }
    }

    const updatedProvider = await ProviderService.updateWitnessDetails(id, witnessDetails);
    
    if (!updatedProvider) {
      return createErrorResponse('Failed to update witness details', 500);
    }

    return createSuccessResponse(
      updatedProvider,
      'Witness details updated successfully'
    );
  } catch (error) {
    console.error('Error updating witness details:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to update witness details',
      500
    );
  }
}

// GET /api/providers/[id]/witness - Get witness details
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Await the params promise
    const { id } = await context.params;
    
    // Verify provider exists
    const provider = await ProviderService.getProviderById(id);
    if (!provider) {
      return createErrorResponse('Provider not found', 404);
    }

    // Check if user can access witness details (own profile or public access)
    // For sensitive witness info, you might want to restrict access
    if (provider.userId !== user.userId) {
      return createAuthErrorResponse('Access denied - can only view your own witness details');
    }

    return createSuccessResponse({
      providerId: id,
      witnessDetails: provider.witnessDetails || []
    });
  } catch (error) {
    console.error('Error fetching witness details:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to fetch witness details',
      500
    );
  }
}

// src/app/api/providers/search/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/services/providerService';

// GET /api/providers/search - Search providers by name or email
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return createErrorResponse('Search query parameter "q" is required', 400);
    }

    if (query.trim().length < 2) {
      return createErrorResponse('Search query must be at least 2 characters long', 400);
    }

    const providers = await ProviderService.searchProviders(query.trim());
    
    return createSuccessResponse({
      providers,
      total: providers.length,
      query: query.trim()
    });
  } catch (error) {
    console.error('Error searching providers:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to search providers',
      500
    );
  }
}