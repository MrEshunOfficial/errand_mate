
// src/app/api/services/[id]/toggle-popular/route.ts
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ServiceService } from '@/lib/services/serviceServices';
import { NextRequest, NextResponse } from 'next/server';


interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/services/[id]/toggle-popular - Toggle service popularity
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const service = await ServiceService.togglePopular(params.id);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        error: 'Service not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: service,
      message: `Service ${service.popular ? 'marked as popular' : 'unmarked as popular'}`
    });
  } catch (error) {
    console.error(`PATCH /api/services/${params.id}/toggle-popular error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle popularity'
    }, { status: 500 });
  }
}