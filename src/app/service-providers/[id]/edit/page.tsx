// src/app/service-providers/[id]/edit/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ServiceProviderLogic } from "@/components/ui/forms/providerForms/serviceProviderLogic";
import { Metadata } from "next";

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToProvider}
                className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Provider</span>
              </Button>
              <div className="border-l border-gray-300 h-6" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Update Service Provider
                </h1>
                <p className="mt-2 text-gray-600">
                  Modify service provider information and settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <ServiceProviderLogic
            mode="update"
            providerId={providerId}
            autoSave={true}
            autoSaveDelay={3000}
            onSuccess={() => {
              // Handle successful update
              console.log("Provider updated successfully");
              // Could show a success message or redirect
              handleBackToProvider();
            }}
            onCancel={() => {
              // Handle cancel action
              handleBackToProvider();
            }}
          />
        </div>

        {/* Additional Actions */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="flex items-center space-x-2">
            <span>View All Providers</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Generate metadata dynamically based on the provider ID
export async function generateMetadata({
  params,
}: UpdateServiceProviderPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const providerId = resolvedParams.id;

  return {
    title: `Edit Provider | Service Management`,
    description: `Update service provider profile and information for provider ${providerId}`,
  };
}
