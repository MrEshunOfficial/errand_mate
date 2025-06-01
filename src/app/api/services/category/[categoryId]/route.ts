// src/app/api/services/category/[categoryId]/route.ts
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ServiceService } from '@/lib/services/serviceServices';
import { NextRequest, NextResponse } from 'next/server';


interface RouteParams {
  params: {
    categoryId: string;
  };
}

// GET /api/services/category/[categoryId] - Get services by category
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const services = await ServiceService.getServicesByCategory(params.categoryId);
    
    return NextResponse.json({
      success: true,
      data: services,
      message: 'Services retrieved successfully'
    });
  } catch (error) {
    console.error(`GET /api/services/category/${params.categoryId} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get services by category'
    }, { status: 500 });
  }
}