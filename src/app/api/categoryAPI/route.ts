import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "../../../lib/services/category.service";
import { CreateCategoryInput } from "@/store/type/service-categories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withServices = searchParams.get("withServices") === "true";

    const categories = withServices
      ? await CategoryService.getCategoriesWithServiceCount()
      : await CategoryService.getAllCategories();

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryInput = await request.json();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await CategoryService.createCategory(body);
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating category:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Category name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
