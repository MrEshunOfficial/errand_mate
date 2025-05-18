import { getCategoryById, addSubcategory } from '@/lib/category-service-lib';
import { NextRequest, NextResponse } from 'next/server';

// POST handler for adding a subcategory to a category
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    const updatedCategory = await addSubcategory(id, { name });
    return NextResponse.json(updatedCategory, { status: 201 });
  } catch (error) {
    console.error('POST subcategory error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}