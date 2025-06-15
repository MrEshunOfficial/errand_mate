// src/components/service-provider/ServiceProviderLogic.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ServiceProviderForm } from "./ServiceProviderForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { useServiceProviderForm } from "@/hooks/useServiceProviderFormHook";
import LoadingOverlay from "../../LoadingOverlay";

interface ServiceProviderLogicProps {
  mode: "create" | "update";
  providerId?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSuccess?: (providerId?: string) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

export const ServiceProviderLogic: React.FC<ServiceProviderLogicProps> = ({
  mode,
  providerId,
  autoSave = false,
  autoSaveDelay = 2000,
  onSuccess,
  onCancel,
  onError,
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Initialize the form hook
  const form = useServiceProviderForm({
    mode,
    providerId,
    autoSave,
    autoSaveDelay,
  });

  const {
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isValidating,
    isSaving,
    submitForm,
    saveForm,
    resetForm,
    getFormProgress,
  } = form;

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const success = await submitForm();
      if (success) {
        setShowSuccessMessage(true);
        onSuccess?.(mode === "create" ? "new-provider-id" : providerId);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      onError?.(errorMessage);
    }
  };

  // Handle manual save (for update mode)
  const handleSave = async () => {
    if (mode === "update") {
      const success = await saveForm();
      if (success) {
        setLastSavedTime(new Date());
      }
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    if (isDirty) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmCancel) return;
    }

    resetForm();
    onCancel?.();
  };

  // Auto-save effect for update mode
  useEffect(() => {
    if (autoSave && mode === "update" && isDirty && !isSaving) {
      const saveInterval = setInterval(async () => {
        const success = await saveForm();
        if (success) {
          setLastSavedTime(new Date());
        }
      }, autoSaveDelay);

      return () => clearInterval(saveInterval);
    }
  }, [autoSave, mode, isDirty, isSaving, saveForm, autoSaveDelay]);

  // Calculate form progress
  const progress = getFormProgress();

  // Show loading overlay during initial load or submission
  if (isSubmitting && mode === "create") {
    return (
      <LoadingOverlay message="Creating service provider..." progress={100} />
    );
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Loading overlay for validation */}
      {isValidating && (
        <LoadingOverlay message="Validating form..." progress={50} />
      )}

      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {mode === "create"
                ? "New Service Provider"
                : "Edit Service Provider"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              {mode === "create"
                ? "Fill in all required information to register a new service provider"
                : "Update service provider information and settings"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {mode === "create" && (
              <div className="w-full sm:w-auto">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Progress: {progress}%
                </div>
                <div className="w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Auto-save indicator */}
            {mode === "update" && autoSave && (
              <div className="flex items-center">
                {isSaving ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  lastSavedTime && (
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Saved </span>
                      <span>{lastSavedTime.toLocaleTimeString()}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              Service provider has been{" "}
              {mode === "create" ? "created" : "updated"} successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Summary */}
      {!isValid && Object.keys(errors).length > 0 && (
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <Alert
            variant="destructive"
            className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              Please fix the following errors before{" "}
              {mode === "create" ? "creating" : "updating"} the service
              provider.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Form Content */}
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50 min-h-[calc(100vh-200px)]">
        <ServiceProviderForm mode={mode} {...form} />
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-2">
            {mode === "update" && isDirty && (
              <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>You have unsaved changes</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isSaving}
              className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>

            {mode === "update" && !autoSave && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleSave}
                disabled={!isDirty || isSaving || isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </>
                )}
              </Button>
            )}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting || isSaving}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Save className="h-4 w-4 animate-spin" />
                  <span>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </span>
                </>
              ) : (
                <span>
                  {mode === "create" ? "Create Provider" : "Update Provider"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
