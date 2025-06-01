// src/app/api/categories/[id]/route.ts
import { connect } from '@/lib/dbconfigue/dbConfigue';
import { CategoryService } from '@/lib/services/categoryService';
import { NextRequest, NextResponse } from 'next/server';


interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/categories/[id] - Get category by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const searchParams = request.nextUrl.searchParams;
    const includeServices = searchParams.get('includeServices') === 'true';
    
    const category = await CategoryService.getCategoryById(params.id, includeServices);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category retrieved successfully'
    });
  } catch (error) {
    console.error(`GET /api/categories/${params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get category'
    }, { status: 500 });
  }
}

// PUT /api/categories/[id] - Update category by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const body = await request.json();
    
    const category = await CategoryService.updateCategory(params.id, body);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error(`PUT /api/categories/${params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category'
    }, { status: 500 });
  }
}

// DELETE /api/categories/[id] - Delete category by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();
    
    const deleted = await CategoryService.deleteCategory(params.id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error(`DELETE /api/categories/${params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category'
    }, { status: 500 });
  }
}