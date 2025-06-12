// src/components/ui/dashboard/ClientDashboardHeader.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ClientData } from "@/store/type/client_provider_Data";

interface ClientDashboardHeaderProps {
  currentClient: ClientData;
}

export function ClientDashboardHeader({
  currentClient,
}: ClientDashboardHeaderProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Logo and Welcome Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/errand-logo.jpg"
              alt="Errand Mate"
              width={60}
              height={60}
              className="rounded-xl shadow-md"
            />
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
                Welcome back, {currentClient.fullName.split(" ")[0]}!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Manage your services and requests
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/services">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Request New Service
          </Button>
        </Link>
      </div>
    </div>
  );
}
