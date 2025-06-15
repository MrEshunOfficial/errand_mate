// src/app/service-providers/[id]/edit/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ServiceProviderLogic } from "@/components/ui/forms/providerForms/serviceProviderLogic";

interface UpdateServiceProviderPageProps {
  params: Promise<{ id: string }>;
}

export default function UpdateServiceProviderPage({
  params,
}: UpdateServiceProviderPageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const providerId = resolvedParams.id;

  const handleBackToProvider = () => {
    router.push(`/service-providers/${providerId}`);
  };

  const handleBackToList = () => {
    router.push("/service-providers");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToProvider}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Provider</span>
              </Button>
              <div className="border-l border-gray-300 dark:border-gray-600 h-6" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Update Service Provider
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Modify service provider information and settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <ServiceProviderLogic
            mode="update"
            providerId={providerId}
            autoSave={true}
            autoSaveDelay={3000}
            onSuccess={() => {
              console.log("Provider updated successfully");
              handleBackToProvider();
            }}
            onCancel={() => {
              handleBackToProvider();
            }}
          />
        </div>

        {/* Additional Actions */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border-gray-300 dark:border-gray-600"
          >
            <span>View All Providers</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
