"use client";
import { useClient } from "@/hooks/useClient";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { ClientDashboard } from "./ClientDashboard";

type DashboardState =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "client_not_found"
  | "error";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { currentClient, getClientByUserId, clearAllErrors } = useClient();
  const [dashboardState, setDashboardState] =
    useState<DashboardState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  // Prevent multiple simultaneous initialization attempts
  const initializingRef = useRef(false);
  // Track if we've already redirected to prevent multiple redirects
  const hasRedirectedRef = useRef(false);

  const MAX_RETRIES = 3;

  const initializeClient = useCallback(
    async (userId: string) => {
      if (initializingRef.current) return;

      initializingRef.current = true;

      try {
        clearAllErrors();
        setError(null);

        console.log(`Initializing client for userId: ${userId}`);
        const clientData = await getClientByUserId(userId);

        // Check for undefined (client not found)
        if (!clientData) {
          console.log("Client not found, redirecting to registration");
          setDashboardState("client_not_found");
          return;
        }

        console.log("Client data found, setting state to authenticated");
        setDashboardState("authenticated");
        setRetryCount(0);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error initializing client:", errorMessage);

        // Real errors (not "not found")
        setError(errorMessage);
        setDashboardState("error");
      } finally {
        initializingRef.current = false;
      }
    },
    [getClientByUserId, clearAllErrors]
  );

  const handleRetry = useCallback(() => {
    if (
      retryCount < MAX_RETRIES &&
      session?.user?.id &&
      !initializingRef.current
    ) {
      console.log(`Retrying initialization, attempt ${retryCount + 1}`);
      setRetryCount((prev) => prev + 1);
      setDashboardState("loading");
      initializeClient(session.user.id);
    }
  }, [retryCount, session?.user?.id, initializeClient]);

  // Handle session changes
  useEffect(() => {
    console.log(`Session status: ${status}`, session);

    // Handle session loading
    if (status === "loading") {
      setDashboardState("loading");
      return;
    }

    // Handle unauthenticated state
    if (status === "unauthenticated" || !session?.user?.id) {
      console.log("User not authenticated, redirecting to login");
      setDashboardState("unauthenticated");
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.push("/user/login");
      }
      return;
    }

    // Reset redirect flag for authenticated users
    hasRedirectedRef.current = false;

    // Initialize client data for authenticated users
    if (session.user.id && !initializingRef.current) {
      console.log("Authenticated user found, initializing client");
      initializeClient(session.user.id);
    }
  }, [session, status, router, initializeClient]);

  // Handle client not found redirect
  useEffect(() => {
    if (dashboardState === "client_not_found" && !hasRedirectedRef.current) {
      console.log("Client not found, redirecting to registration");
      hasRedirectedRef.current = true;

      // Add a small delay to prevent rapid redirects
      const timer = setTimeout(() => {
        router.push("/customer/register");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [dashboardState, router]);

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 p-8">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-sm text-gray-600">
            Please wait while we prepare your dashboard...
          </p>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg border border-red-200 p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-lg font-semibold text-red-800">
              Unable to Load Dashboard
            </h2>
          </div>

          <p className="text-gray-600 mb-4">
            We&apos;re having trouble loading your dashboard. This might be due
            to a temporary network issue.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700 break-words">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {retryCount < MAX_RETRIES ? (
              <button
                onClick={handleRetry}
                disabled={initializingRef.current}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again ({retryCount + 1}/{MAX_RETRIES})
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Maximum retry attempts reached. Please try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClientNotFoundState = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Setup Required
          </h2>
          <p className="text-gray-600 mb-4">
            We&apos;re redirecting you to complete your account setup...
          </p>
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
        </div>
      </div>
    </div>
  );

  // Render based on dashboard state
  switch (dashboardState) {
    case "loading":
      return renderLoadingState();

    case "error":
      return renderErrorState();

    case "client_not_found":
      return renderClientNotFoundState();

    case "authenticated":
      if (currentClient) {
        return <ClientDashboard />;
      }
      // If authenticated but no currentClient yet, show loading
      return renderLoadingState();

    case "unauthenticated":
    default:
      return renderLoadingState();
  }
}
