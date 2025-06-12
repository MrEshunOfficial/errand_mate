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
  const [debugInfo, setDebugInfo] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.warn("⚠️ Fallback timeout triggered - forcing initialization");
      setInitError("Loading timed out. Please refresh the page.");
      setIsInitialized(true);
    }, 15000); // 15 seconds fallback

    const initializeClientData = async () => {
      console.log("🔄 Dashboard initialization started");
      console.log("📊 Session status:", status);
      console.log("👤 Session data:", session);

      setDebugInfo(
        `Status: ${status}, Session: ${session ? "exists" : "null"}`
      );

      if (status === "loading") {
        console.log("⏳ Session still loading...");
        return;
      }

      if (status === "unauthenticated" || !session?.user?.id) {
        console.log("🚫 Not authenticated, redirecting to login");
        clearTimeout(fallbackTimeout); // Clear timeout before redirect
        router.push("/user/login");
        return;
      }

      try {
        console.log("🧹 Clearing previous errors");
        clearAllErrors();
        setInitError(null);

        console.log("🔍 Fetching client data for user ID:", session.user.id);
        console.log("🌐 API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
        console.log("🏗️ Environment:", process.env.NODE_ENV);
        setDebugInfo((prev) => prev + " | Fetching client data...");

        // Add timeout to prevent infinite hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Request timeout after 10 seconds")),
            10000
          );
        });

        const clientDataPromise = getClientByUserId(session.user.id);
        const clientData = await Promise.race([
          clientDataPromise,
          timeoutPromise,
        ]);

        console.log("📦 Client data received:", clientData);
        setDebugInfo((prev) => prev + " | Client data received");

        if (!clientData) {
          console.log("❌ No client found - redirecting to registration");
          clearTimeout(fallbackTimeout); // Clear timeout before redirect
          router.push("/customer/register");
          return;
        }

        console.log("✅ Client data found successfully");
        setDebugInfo((prev) => prev + " | Success!");

        // CRITICAL: Clear the fallback timeout on successful initialization
        clearTimeout(fallbackTimeout);
        setIsInitialized(true);
      } catch (error) {
        console.error("💥 Error in initializeClientData:", error);
        setDebugInfo((prev) => prev + ` | Error: ${error}`);

        // Clear timeout when handling errors
        clearTimeout(fallbackTimeout);

        if (error instanceof Error) {
          const errorMessage = error.message;
          console.log("🔍 Error message:", errorMessage);

          // Check if it's a 404 error (client not found)
          if (
            errorMessage.includes("404") ||
            errorMessage.includes("status: 404") ||
            errorMessage === "HTTP error! status: 404"
          ) {
            console.log(
              "🔄 Client not found (404) - redirecting to registration"
            );
            router.push("/customer/register");
            return;
          }

          // For timeout errors, still set initialized to show error UI
          if (errorMessage.includes("timeout")) {
            console.error("⏰ Request timed out");
            setInitError(
              "Request timed out. Please check your connection and try again."
            );
            setIsInitialized(true);
            return;
          }

          console.error("🚨 HTTP error:", errorMessage);
          setInitError(errorMessage);
        } else {
          const errorStr = String(error);
          console.error("🚨 Unknown error:", errorStr);

          if (errorStr.includes("404") || errorStr.includes("status: 404")) {
            console.log(
              "🔄 Client not found (404) - redirecting to registration"
            );
            router.push("/customer/register");
            return;
          }

          setInitError("An unexpected error occurred: " + errorStr);
        }

        // CRITICAL: Always set initialized to true to break out of loading state
        setIsInitialized(true);
      }
    };

    initializeClientData();

    // Cleanup fallback timeout
    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [session, status, getClientByUserId, clearAllErrors, router]);

  // Show loading spinner while initializing
  if (!isInitialized || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          {/* Show debug info in development */}
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-gray-400 max-w-md text-center break-words">
              Debug: {debugInfo}
            </p>
          )}
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
            {/* Show debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-gray-400 mb-4 break-words">
                Debug: {debugInfo}
              </p>
            )}
            <button
              onClick={() => {
                setInitError(null);
                setIsInitialized(false);
                setDebugInfo("");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
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
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-gray-400">Debug: {debugInfo}</p>
        )}
      </div>
    </div>
  );
}
