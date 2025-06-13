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
    <div className="relative">
      {/* Loading overlay for validation */}
      {isValidating && (
        <LoadingOverlay message="Validating form..." progress={50} />
      )}

      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {mode === "create"
                ? "New Service Provider"
                : "Edit Service Provider"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {mode === "create"
                ? "Fill in all required information to register a new service provider"
                : "Update service provider information and settings"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            {mode === "create" && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  Progress: {progress}%
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Auto-save indicator */}
            {mode === "update" && autoSave && (
              <div className="text-right">
                {isSaving ? (
                  <div className="flex items-center text-blue-600 text-sm">
                    <Save className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  lastSavedTime && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Saved {lastSavedTime.toLocaleTimeString()}
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
        <div className="p-4 border-b border-gray-200">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Service provider has been{" "}
              {mode === "create" ? "created" : "updated"} successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Summary */}
      {!isValid && Object.keys(errors).length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the following errors before{" "}
              {mode === "create" ? "creating" : "updating"} the service
              provider.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Form Content */}
      <div className="p-6">
        <ServiceProviderForm mode={mode} {...form} />
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {mode === "update" && isDirty && (
              <div className="text-sm text-amber-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                You have unsaved changes
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isSaving}>
              Cancel
            </Button>

            {mode === "update" && !autoSave && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleSave}
                disabled={!isDirty || isSaving || isSubmitting}
                className="flex items-center space-x-2">
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
              className="flex items-center space-x-2">
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
