// src/app/api/clients/me/[userId]/route.ts
import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  createAuthErrorResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/auth-utils";
import { connect } from "@/lib/dbconfigue/dbConfigue";
import { ClientServices } from "@/lib/services/clientService";

// Type definition for Next.js 15+ App Router
interface RouteContext {
  params: Promise<{ userId: string }>;
}

// GET /api/clients/me/[userId] - Get current user's client profile
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connect();

    // Await the params promise (required in Next.js 15)
    const { userId } = await context.params;

    // Validate userId parameter
    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      console.log("Authentication failed for userId:", userId);
      return createAuthErrorResponse();
    }

    // Security check: ensure user can only access their own data
    if (user.userId !== userId) {
      console.log(
        "Access denied: authenticated user",
        user.userId,
        "trying to access",
        userId
      );
      return createAuthErrorResponse("Access denied");
    }

    const clientResponse = await ClientServices.getClientByUserId(userId);

    // Handle the ApiResponse structure
    if (!clientResponse.success || !clientResponse.data) {
      return createErrorResponse(
        clientResponse.error || "Client profile not found",
        clientResponse.statusCode || 404
      );
    }

    return createSuccessResponse(clientResponse.data);
  } catch (error) {
    console.error("Error fetching client profile:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      userId: context.params
        ? await context.params.then((p) => p.userId).catch(() => "unknown")
        : "unknown",
    });

    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch client profile",
      500
    );
  }
}

// PUT /api/clients/me/[userId] - Update current user's client profile
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connect();

    // Await the params promise
    const { userId } = await context.params;

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Security check: ensure user can only update their own data
    if (user.userId !== userId) {
      return createAuthErrorResponse("Access denied");
    }

    // Get the existing client first
    const clientResponse = await ClientServices.getClientByUserId(userId);

    // Handle the ApiResponse structure
    if (!clientResponse.success || !clientResponse.data) {
      return createErrorResponse(
        clientResponse.error || "Client profile not found",
        clientResponse.statusCode || 404
      );
    }

    const updateData = await request.json();
    const updatedClient = await ClientServices.updateClient(
      clientResponse.data._id.toString(),
      updateData
    );

    return createSuccessResponse(updatedClient);
  } catch (error) {
    console.error("Error updating client profile:", error);
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Failed to update client profile",
      500
    );
  }
}

// DELETE /api/clients/me/[userId] - Delete current user's client profile
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connect();

    // Await the params promise
    const { userId } = await context.params;

    if (!userId) {
      return createErrorResponse("User ID is required", 400);
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return createAuthErrorResponse();
    }

    // Security check: ensure user can only delete their own data
    if (user.userId !== userId) {
      return createAuthErrorResponse("Access denied");
    }

    // Get the existing client first
    const clientResponse = await ClientServices.getClientByUserId(userId);

    // Handle the ApiResponse structure
    if (!clientResponse.success || !clientResponse.data) {
      return createErrorResponse(
        clientResponse.error || "Client profile not found",
        clientResponse.statusCode || 404
      );
    }

    const deleted = await ClientServices.deleteClient(
      clientResponse.data._id.toString()
    );

    if (!deleted) {
      return createErrorResponse("Failed to delete client profile", 500);
    }

    return createSuccessResponse({
      message: "Client profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client profile:", error);
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Failed to delete client profile",
      500
    );
  }
}
