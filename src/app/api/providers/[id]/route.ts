// src/app/api/providers/[id]/route.ts
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