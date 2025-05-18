import { getCategoryById, updateCategory, deleteCategory } from '@/lib/category-service-lib';
import { NextRequest, NextResponse } from 'next/server';

// Define the correct type for params
type CategoryParams = {
  params: {
    id: string;
  };
};

// GET handler with proper type annotation
export async function GET(
  request: NextRequest,
  context: CategoryParams
) {
  try {
    const { id } = context.params;
    
    const category = await getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('GET category error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT handler with proper type annotation
export async function PUT(
  request: NextRequest,
  context: CategoryParams
) {
  try {
    const { id } = context.params;
    const body = await request.json();
    
    const updatedCategory = await updateCategory(id, body);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('PUT category error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler with proper type annotation
export async function DELETE(
  request: NextRequest,
  context: CategoryParams
) {
  try {
    const { id } = context.params;
    
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE category error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}