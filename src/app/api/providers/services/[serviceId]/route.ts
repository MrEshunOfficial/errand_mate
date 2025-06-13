// src/app/api/providers/services/[serviceId]/route.ts
import { NextRequest } from 'next/server';
import { 
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse 
} from '@/lib/auth-utils';
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ProviderService } from '@/lib/services/providerServices';

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