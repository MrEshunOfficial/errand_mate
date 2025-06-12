"use client";
import { useClient } from "@/hooks/useClient";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ClientDashboard } from "./ClientDashboard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { currentClient, getClientByUserId, clearAllErrors } = useClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeClientData = async () => {
      if (status === "loading") return; // Still loading session

      if (status === "unauthenticated" || !session?.user?.id) {
        router.push("/user/login");
        return;
      }

      try {
        // Clear any previous errors
        clearAllErrors();
        setInitError(null);

        // Try to fetch client data by user ID
        const clientData = await getClientByUserId(session.user.id);

        if (!clientData) {
          // No client found - redirect to registration
          console.log("No client found - redirecting to registration");
          router.push("/customer/register");
          return;
        }

        // Client data found successfully
        setIsInitialized(true);
      } catch (error) {
        // Handle different types of errors
        if (error instanceof Error) {
          const errorMessage = error.message;

          // Check if it's a 404 error (client not found) - Fixed condition
          if (
            errorMessage.includes("404") ||
            errorMessage.includes("status: 404") ||
            errorMessage === "HTTP error! status: 404"
          ) {
            console.log("Client not found (404) - redirecting to registration");
            router.push("/customer/register");
            return;
          }

          // For other HTTP errors, set the error state
          console.error("Error fetching client data:", errorMessage);
          setInitError(errorMessage);
        } else {
          // Handle non-Error objects that might be thrown
          const errorStr = String(error);

          // Check for 404 in non-Error objects too
          if (errorStr.includes("404") || errorStr.includes("status: 404")) {
            console.log("Client not found (404) - redirecting to registration");
            router.push("/customer/register");
            return;
          }

          console.error("Unknown error fetching client data:", error);
          setInitError("An unexpected error occurred");
        }

        setIsInitialized(true);
      }
    };

    initializeClientData();
  }, [session, status, getClientByUserId, clearAllErrors, router]);

  // Show loading spinner while initializing
  if (!isInitialized || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an initialization error (not 404)
  if (initError) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Dashboard
            </h1>
            <p className="text-red-600 mb-4">
              We encountered an error while loading your dashboard.
            </p>
            <p className="text-sm text-red-500 mb-4">{initError}</p>
            <button
              onClick={() => {
                setInitError(null);
                setIsInitialized(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show client dashboard if client exists
  if (currentClient) {
    return <ClientDashboard />;
  }

  // Fallback - should not reach here if logic is correct
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Preparing your dashboard...
        </p>
      </div>
    </div>
  );
}
