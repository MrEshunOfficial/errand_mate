// src/app/service-providers/create/page.tsx
"use client";

import { ServiceProviderLogic } from "@/components/ui/forms/providerForms/serviceProviderLogic";
import React from "react";

export default function CreateServiceProviderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Register New Service Provider
              </h1>
              <p className="mt-2 text-gray-600">
                Create a new service provider profile with all required
                information
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <ServiceProviderLogic
            mode="create"
            // Optional: Add any create-specific props here
            onSuccess={(providerId) => {
              // Handle successful creation
              console.log("Provider created successfully:", providerId);
              // Could redirect to provider details page
              // router.push(`/service-providers/${providerId}`);
            }}
            onCancel={() => {
              // Handle cancel action
              // router.back();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// // Export metadata for the page
// export const metadata: Metadata = {
//   title: "Create Service Provider | Service Management",
//   description:
//     "Register a new service provider with complete profile information",
// };
