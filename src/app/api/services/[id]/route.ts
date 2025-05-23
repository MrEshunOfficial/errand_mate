import { ServiceService } from "@/lib/services/service.services";
import { UpdateServiceInput } from "@/store/type/service-categories";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const withCategory = searchParams.get("withCategory") === "true";

    const service = withCategory
      ? await ServiceService.getServiceWithCategory(params.id)
      : await ServiceService.getServiceById(params.id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const updateData: UpdateServiceInput = { id: params.id, ...body };

    const service = await ServiceService.updateService(updateData);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error: unknown) {
    console.error("Error updating service:", error);

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
      { success: false, error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await ServiceService.deleteService(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
