import { getCategoryById, updateCategory, deleteCategory } from '@/lib/category-service-lib';
import { NextRequest, NextResponse } from 'next/server';

// GET handler for fetching a category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object to get the id
    const { id } = await params;
    
    const category = await getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('GET category error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object to get the id
    const { id } = await params;
    const body = await request.json();
    
    const updatedCategory = await updateCategory(id, body);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('PUT category error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object to get the id
    const { id } = await params;
    
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE category error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}