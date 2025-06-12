// src/app/api/clients/me/[userId]/route.ts
import {
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-utils";
import { connect } from "@/lib/dbconfigue/dbConfigue";
import { ClientServices } from "@/lib/services/clientService";

// GET /api/clients/me - Get current user's client profile
// src/app/api/clients/me/[userId]/route.ts
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();

    // Validate the userId parameter
    if (!params.userId) {
      return createErrorResponse("User ID is required", 400);
    }

    // Still authenticate the user for security
    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Ensure the authenticated user can only access their own data
    if (user.userId !== params.userId) {
      return createErrorResponse("Unauthorized access", 403);
    }

    const client = await ClientServices.getClientByUserId(params.userId);

    if (!client) {
      return createErrorResponse("Client profile not found", 404);
    }

    return createSuccessResponse(client);
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch client profile",
      500
    );
  }
}
