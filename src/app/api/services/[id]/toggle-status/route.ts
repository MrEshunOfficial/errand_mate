// src/app/api/services/[id]/toggle-status/route.ts
import { ServiceService } from "@/lib/services/service.services";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const service = await ServiceService.toggleServiceStatus(params.id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error toggling service status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle service status" },
      { status: 500 }
    );
  }
}
