import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/category-service-lib";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

// GET handler for fetching a category by ID
export async function GET(request: NextRequest, props: Props) {
  try {
    const id = props.params.id;

    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET category error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT handler for updating a category
export async function PUT(request: NextRequest, props: Props) {
  try {
    const id = props.params.id;
    const body = await request.json();

    const updatedCategory = await updateCategory(id, body);

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PUT category error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a category
export async function DELETE(request: NextRequest, props: Props) {
  try {
    const id = props.params.id;

    const deleted = await deleteCategory(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
