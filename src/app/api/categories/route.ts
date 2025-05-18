import { getAllCategories, createCategory } from '@/lib/category-service-lib';
import { NextRequest, NextResponse } from 'next/server';

// GET handler for fetching all categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST handler for creating a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCategory = await createCategory(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('POST category error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}