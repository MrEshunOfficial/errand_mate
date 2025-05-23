// src/app/api/services/search/route.ts
import { ServiceService } from "@/lib/services/service.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    const services = await ServiceService.searchServices(query, limit);
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error searching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search services" },
      { status: 500 }
    );
  }
}
