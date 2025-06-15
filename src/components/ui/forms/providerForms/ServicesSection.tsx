// src/components/service-provider/ServicesSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Types } from "mongoose";
import { AlertCircle, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategory";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";
import ServiceSelector from "./ServiceSelectore";

interface ServicesSectionProps {
  formData: ServiceProviderFormData;
  errors: FormFieldErrors;
  addService: (serviceId: Types.ObjectId) => void;
  removeService: (serviceId: Types.ObjectId) => void;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
  showValidationErrors?: boolean; // Add prop to control when to show validation errors
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  formData,
  addService,
  removeService,
  validateField,
  getFieldError,
  disabled = false,
  showValidationErrors = false, // Default to false - only show on form submission attempt
}) => {
  // Hooks
  const { services, loading, error, getServices } = useServices();
  const { categories, getCategories } = useCategories();

  // Local state to track if user has interacted with the field
  const [hasInteracted, setHasInteracted] = useState(false);

  // Load services and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getServices({ limit: 100 }), // Fetch all active services
          getCategories({ limit: 100 }), // Fetch all categories
        ]);
      } catch (error) {
        console.error("Failed to fetch services and categories:", error);
      }
    };

    loadData();
  }, [getServices, getCategories]);

  // Utility function to safely compare ObjectIds/strings
  const compareIds = (
    id1: Types.ObjectId | string,
    id2: Types.ObjectId | string
  ): boolean => {
    return id1.toString() === id2.toString();
  };

  // Handle service toggle
  const handleServiceToggle = (serviceId: Types.ObjectId) => {
    if (disabled) return;

    // Mark as interacted when user makes their first selection
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    const isSelected = formData.serviceRendering.some((id) =>
      compareIds(id, serviceId)
    );

    if (isSelected) {
      removeService(serviceId);
    } else {
      addService(serviceId);
    }

    // Validate the field after changing - but don't show error immediately
    setTimeout(() => validateField("serviceRendering"), 100);
  };

  // Handle clear all services
  const handleClearAll = () => {
    if (disabled) return;

    formData.serviceRendering.forEach((serviceId) => {
      removeService(serviceId);
    });

    // Validate after clearing
    setTimeout(() => validateField("serviceRendering"), 100);
  };

  const fieldError = getFieldError("serviceRendering");

  // Only show error if:
  // 1. showValidationErrors is true (form submission attempted), AND
  // 2. There's a field error
  // Convert to boolean explicitly
  const shouldShowError = Boolean(showValidationErrors && fieldError);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Loading Services
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we fetch available services...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
            Failed to Load Services
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!services || !categories) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No Data Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Services and categories could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service Selector */}
      <ServiceSelector
        services={services}
        categories={categories}
        selectedServices={formData.serviceRendering}
        onServiceToggle={handleServiceToggle}
        onClearAll={handleClearAll}
        disabled={disabled}
        showError={shouldShowError}
      />

      {/* Help Text */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          Service Selection Guidelines
        </h4>
        <ul className="space-y-1 text-sm">
          <li>• Select all services that this provider can offer</li>
          <li>• You can search and filter services by category</li>
          <li>• At least one service must be selected to proceed</li>
          <li>
            • Use the category checkboxes to quickly select/deselect all
            services in a category
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ServicesSection;
