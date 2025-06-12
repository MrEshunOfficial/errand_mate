// hooks/useSessionCleanup.ts
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useSessionCleanup() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Clear any local storage or session storage on logout
    const handleStorageCleanup = () => {
      if (typeof window !== "undefined") {
        // Clear any application-specific data
        localStorage.removeItem("user-preferences");
        localStorage.removeItem("app-state");
        sessionStorage.clear();

        // Clear any cached data
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name);
            });
          });
        }
      }
    };

    // If session becomes null/undefined (user logged out), clean up
    if (status === "unauthenticated") {
      handleStorageCleanup();
    }
  }, [status]);

  useEffect(() => {
    // Listen for storage events (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "logout-event") {
        // Force redirect to login page
        router.push("/user/login");
        router.refresh();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [router]);

  const forceLogout = () => {
    // Trigger logout event for other tabs
    localStorage.setItem("logout-event", Date.now().toString());
    localStorage.removeItem("logout-event");

    // Redirect to login
    router.push("/user/login");
    router.refresh();
  };

  return { forceLogout };
}

// Component to use in your app layout
export function SessionCleanupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useSessionCleanup();
  return <>{children}</>;
}
