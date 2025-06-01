
// src/app/api/services/[id]/toggle-active/route.ts
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ServiceService } from '@/lib/services/serviceServices';
import { NextRequest, NextResponse } from 'next/server';


interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/services/[id]/toggle-active - Toggle service active status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const service = await ServiceService.toggleActive(params.id);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        error: 'Service not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: service,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'}`
    });
  } catch (error) {
    console.error(`PATCH /api/services/${params.id}/toggle-active error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle active status'
    }, { status: 500 });
  }
}