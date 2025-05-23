import { ServiceService } from "@/lib/services/service.services";
import {
  ServiceFilters,
  CreateServiceInput,
} from "@/store/type/service-categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("categoryId") || undefined;
    const isActive = searchParams.get("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined;
    const popular = searchParams.get("popular")
      ? searchParams.get("popular") === "true"
      : undefined;
    const locations = searchParams.get("locations")?.split(",") || undefined;
    const search = searchParams.get("search") || undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filters: ServiceFilters = {
      categoryId,
      isActive,
      popular,
      locations,
      search,
      ...(minPrice &&
        maxPrice && {
          priceRange: {
            min: parseFloat(minPrice),
            max: parseFloat(maxPrice),
          },
        }),
    };

    const result = await ServiceService.getAllServices(page, limit, filters);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateServiceInput = await request.json();

    if (!body.title || !body.description || !body.categoryId || !body.pricing) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const service = await ServiceService.createService(body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating service:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: string }).message === "string" &&
      (error as { message: string }).message.includes("Invalid category ID")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
