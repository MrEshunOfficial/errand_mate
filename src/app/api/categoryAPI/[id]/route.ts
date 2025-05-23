import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "../../../../lib/services/category.service";
import { UpdateCategoryInput } from "@/store/type/service-categories";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const withServices = searchParams.get("withServices") === "true";

    let category;
    if (withServices) {
      category = await CategoryService.getCategoryWithServices(params.id);
    } else {
      category = await CategoryService.getCategoryById(params.id);
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const updateData: UpdateCategoryInput = { id: params.id, ...body };

    const category = await CategoryService.updateCategory(updateData);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: unknown) {
    console.error("Error updating category:", error);

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
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await CategoryService.deleteCategory(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting category:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: string }).message === "string" &&
      (error as { message: string }).message.includes(
        "Cannot delete category with existing services"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with existing services",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
