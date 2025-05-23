// src/app/api/services/popular/route.ts
import { ServiceService } from "@/lib/services/service.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const services = await ServiceService.getPopularServices(limit);
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching popular services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular services" },
      { status: 500 }
    );
  }
}
