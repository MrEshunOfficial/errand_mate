// src/app/api/services/route.ts
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { ServiceService } from '@/lib/services/serviceServices';
import { NextRequest, NextResponse } from 'next/server';


// GET /api/services - Get all services with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const searchParams = request.nextUrl.searchParams;
    
    const options = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as 'title' | 'popular' | 'createdAt') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      search: searchParams.get('search') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      popular: searchParams.get('popular') ? searchParams.get('popular') === 'true' : undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      includeCategory: searchParams.get('includeCategory') === 'true'
    };

    const result = await ServiceService.getServices(options);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Services retrieved successfully'
    });
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get services'
    }, { status: 500 });
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'title is required and must be a string'
      }, { status: 400 });
    }
    
    if (!body.description || typeof body.description !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'description is required and must be a string'
      }, { status: 400 });
    }
    
    if (!body.categoryId || typeof body.categoryId !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'categoryId is required and must be a string'
      }, { status: 400 });
    }

    const service = await ServiceService.createService(body);
    
    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create service'
    }, { status: 500 });
  }
}
