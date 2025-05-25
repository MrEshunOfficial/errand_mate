// src/app/api/categoryAPI/route.ts - Fixed with proper JSON validation
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
    // Check content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // Get the raw text first to check if it's empty
    const text = await request.text();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Request body is empty" },
        { status: 400 }
      );
    }

    let body: CreateCategoryInput;

    try {
      body = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request body must be a valid object" },
        { status: 400 }
      );
    }

    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Category name is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    // Trim the name to avoid whitespace issues
    body.name = body.name.trim();

    const category = await CategoryService.createCategory(body);
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating category:", error);

    // Handle MongoDB duplicate key error
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

    // Handle other known errors
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
