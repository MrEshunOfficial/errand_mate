// src/app/service-providers/create/page.tsx
"use client";

import { ServiceProviderLogic } from "@/components/ui/forms/providerForms/serviceProviderLogic";
import { useRouter } from "next/navigation";
import React from "react";

export default function CreateServiceProviderPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Register New Service Provider
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Create a new service provider profile with all required
                information
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <ServiceProviderLogic
            mode="create"
            onSuccess={(providerId) => {
              console.log("Provider created successfully:", providerId);
              router.push(`/service-providers/${providerId}`);
            }}
            onCancel={() => {
              router.back();
            }}
          />
        </div>
      </div>
    </div>
  );
}
