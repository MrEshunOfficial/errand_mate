import { getCategoryById, updateSubcategory, deleteSubcategory } from '@/lib/category-service-lib';
import { NextRequest, NextResponse } from 'next/server';

// PUT handler for updating a subcategory
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; subcategoryId: string } }
) {
  try {
    const { id, subcategoryId } = params;
    
    // Check if category exists
    const categoryExists = await getCategoryById(id);
    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json(
        { message: 'Subcategory name is required' },
        { status: 400 }
      );
    }
    
    const updatedCategory = await updateSubcategory(id, subcategoryId, { name });
    
    if (!updatedCategory) {
      return NextResponse.json(
        { message: 'Subcategory not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('PUT subcategory error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a subcategory
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; subcategoryId: string } }
) {
  try {
    const { id, subcategoryId } = params;
    
    // Check if category exists
    const categoryExists = await getCategoryById(id);
    if (!categoryExists) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    const result = await deleteSubcategory(id, subcategoryId);
    
    if (!result) {
      return NextResponse.json(
        { message: 'Subcategory not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('DELETE subcategory error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}