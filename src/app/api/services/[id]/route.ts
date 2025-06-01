
// src/app/api/services/[id]/route.ts
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ServiceService } from '@/lib/services/serviceServices';
import { NextRequest, NextResponse } from 'next/server';


interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/services/[id] - Get service by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const searchParams = request.nextUrl.searchParams;
    const includeCategory = searchParams.get('includeCategory') === 'true';
    
    const service = await ServiceService.getServiceById(params.id, includeCategory);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        error: 'Service not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service retrieved successfully'
    });
  } catch (error) {
    console.error(`GET /api/services/${params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get service'
    }, { status: 500 });
  }
}

// PUT /api/services/[id] - Update service by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const body = await request.json();
    
    const service = await ServiceService.updateService(params.id, body);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        error: 'Service not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error(`PUT /api/services/${params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update service'
    }, { status: 500 });
  }
}

// DELETE /api/services/[id] - Delete service by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const deleted = await ServiceService.deleteService(params.id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Service not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error(`DELETE /api/services/${params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete service'
    }, { status: 500 });
  }
}
