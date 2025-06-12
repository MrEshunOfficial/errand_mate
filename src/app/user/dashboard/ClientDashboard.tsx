// src/components/ui/dashboard/ClientDashboard.tsx
"use client";
import { useClient } from "@/hooks/useClient";
import { useEffect } from "react";
import { ClientDashboardContent } from "./DashboardContent";
import { ClientDashboardHeader } from "./DashboardHeader";
import { ClientProfileSidebar } from "./ProfileSidebar";

export function ClientDashboard() {
  const {
    currentClient,
    serviceRequests,
    completedServiceRequests,
    pendingServiceRequests,
    stats,
    getServiceRequestHistory,
    getClientStats,
  } = useClient();

  useEffect(() => {
    if (currentClient?._id) {
      getServiceRequestHistory(currentClient._id.toString());
      getClientStats(currentClient._id.toString());
    }
  }, [currentClient, getServiceRequestHistory, getClientStats]);

  if (!currentClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto py-3 px-3 sm:py-6 sm:px-4 max-w-7xl">
        {/* Header Section */}
        <ClientDashboardHeader currentClient={currentClient} />

        {/* Mobile-First Responsive Layout */}
        <div className="mt-4 sm:mt-8 space-y-6 lg:space-y-0 lg:flex lg:gap-8">
          {/* Main Content - Full width on mobile, flex-1 on desktop */}
          <div className="w-full lg:flex-1">
            <ClientDashboardContent
              serviceRequests={serviceRequests}
              completedServiceRequests={completedServiceRequests}
              pendingServiceRequests={pendingServiceRequests}
              stats={stats}
            />
          </div>

          {/* Profile Sidebar - Full width on mobile, fixed width on desktop */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <ClientProfileSidebar currentClient={currentClient} />
          </div>
        </div>
      </div>
    </div>
  );
}
