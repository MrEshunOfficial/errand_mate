// src/app/admin/services/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategory";
import { Category, UpdateServiceInput } from "@/store/type/service-categories";
import { updateService } from "@/store/slices/service-slice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

import {
  transformToUpdateServiceInput,
  getErrorMessage,
} from "@/lib/utils/serviceTransform";
import ErrorMessage from "@/app/admin/[id]/services/new/ErrorMessage";
import ServiceForm from "@/app/admin/[id]/services/new/form-components/ServicForm";
import LoadingSpinner from "@/app/admin/[id]/services/new/LoadingSpiner";
import PageHeader from "@/app/admin/[id]/services/new/PageHeader";
import {
  CreateServiceFormData,
  createServiceFormSchema,
} from "@/app/admin/[id]/services/new/service-shema";

const EditServicePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id as string;

  // Hooks
  const {
    currentService,
    updateExistingService,
    removeService,
    loadService,
    clearService,
    resetErrors,
    loading,
    error,
  } = useServices();

  const {
    selectedCategory,
    loadCategory,
    getCategoryById,
    loading: categoryLoading,
    error: categoryError,
  } = useCategories();

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(
    null
  );

  // Get current category
  const currentCategory =
    selectedCategory ||
    (currentService?.categoryId
      ? getCategoryById(currentService.categoryId)
      : null);

  // Main initialization effect - runs once when component mounts
  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      if (!serviceId) {
        toast.error("Service ID is required");
        router.push("/admin");
        return;
      }

      try {
        // Reset any previous errors
        setInitializationError(null);
        resetErrors();

        // Load service if we don't have it or it's different
        if (!currentService || currentService.id !== serviceId) {
          await loadService(serviceId, true);
        }
      } catch (error) {
        if (isMounted) {
          setInitializationError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    // Only initialize if not already initialized
    if (!isInitialized) {
      initializePage();
    }

    return () => {
      isMounted = false;
    };
  }, [serviceId]); // Only depend on serviceId

  // Category loading effect - separate from main initialization
  useEffect(() => {
    if (
      isInitialized &&
      currentService?.categoryId &&
      !currentCategory &&
      !categoryLoading
    ) {
      loadCategory(currentService.categoryId, false);
    }
  }, [
    isInitialized,
    currentService?.categoryId,
    currentCategory,
    categoryLoading,
    loadCategory,
  ]);

  // Cleanup effect - runs only on unmount
  useEffect(() => {
    return () => {
      resetErrors();
      clearService();
    };
  }, []); // Empty dependency array for unmount only

  // Handlers
  const handleFormSubmit = async (formData: CreateServiceFormData) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      if (!currentService) {
        throw new Error("Service not found");
      }

      // Clear any previous errors before attempting to update
      resetErrors();

      // Validate form data
      const validationResult = createServiceFormSchema.safeParse(formData);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          const path = error.path.join(".");
          errors[path] = error.message;
        });

        // Show validation errors to user
        const errorMessages = Object.values(errors).join(", ");
        const errorMsg = `Please fix the form errors: ${errorMessages}`;
        setFormError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Transform form data to update input
      const updateInput: UpdateServiceInput = {
        id: currentService.id,
        ...transformToUpdateServiceInput(validationResult.data),
      };

      // Update service
      const result = await updateExistingService(updateInput);

      // Check if the action was fulfilled
      if (updateService.fulfilled.match(result)) {
        toast.success("Service updated successfully");
        router.push(`/admin/services/${currentService.categoryId}`);
      } else if (updateService.rejected.match(result)) {
        // Handle rejected action
        const errorMessage = getErrorMessage(result.payload);
        setFormError(errorMessage);
        toast.error(errorMessage);
      } else {
        // Handle unexpected result
        const errorMessage = "Failed to update service";
        setFormError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetErrors();
    setFormError(null);
    if (currentService?.categoryId) {
      router.push(`/admin/services/${currentService.categoryId}`);
    } else {
      router.push("/admin");
    }
  };

  const handleGoBack = () => {
    resetErrors();
    setFormError(null);
    router.back();
  };

  const handleDelete = async () => {
    if (!currentService) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the service "${currentService.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await removeService(currentService.id);
      toast.success("Service deleted successfully");
      router.push(`/admin/services/${currentService.categoryId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRetryInitialization = () => {
    setIsInitialized(false);
    setInitializationError(null);
    resetErrors();
  };

  // Determine loading state
  const isServiceLoading = !isInitialized || loading.currentService;
  const isCategoryLoading =
    currentService && !currentCategory && categoryLoading;
  const isPageLoading = isServiceLoading || isCategoryLoading;

  // Early return for loading states
  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isServiceLoading ? "Loading service..." : "Loading category..."}
          </p>
        </div>
      </div>
    );
  }

  // Error states
  if (initializationError || error?.currentService) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <ErrorMessage
          title="Failed to load service"
          message={
            initializationError ||
            error?.currentService ||
            "Unknown error occurred"
          }
          onRetry={handleRetryInitialization}
        />
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <ErrorMessage
          title="Failed to load category"
          message={categoryError}
          onRetry={() =>
            currentService?.categoryId &&
            loadCategory(currentService.categoryId, false)
          }
        />
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <ErrorMessage
          title="Service not found"
          message="The requested service could not be found."
          onRetry={handleGoBack}
          retryLabel="Go Back"
        />
      </div>
    );
  }

  if (!currentCategory && !categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <ErrorMessage
          title="Category not found"
          message="The service's category could not be found."
          onRetry={() =>
            currentService.categoryId &&
            loadCategory(currentService.categoryId, false)
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Page Header */}
      <PageHeader
        title="Edit Service"
        subtitle={`Update service details for ${currentService.title}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Categories", href: `/admin/${currentCategory?.id}` },
          {
            label: currentCategory?.name || "Category",
            href: `/admin/services/${currentCategory?.id}`,
          },
          {
            label: currentService.title,
            href: "#",
            current: true,
          },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isDeleting}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              Cancel
            </Button>
          </div>
        }
      />

      {/* Display form errors */}
      {formError && (
        <div className="mt-6">
          <ErrorMessage
            title="Form Error"
            message={formError}
            onRetry={() => {
              setFormError(null);
              resetErrors();
            }}
            retryLabel="Clear Error"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mt-8">
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10 transition-colors duration-200">
          {/* Service Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentService.icon && (
                  <div className="text-2xl filter dark:brightness-110">
                    {currentService.icon}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {currentService.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Category: {currentCategory?.name || "Loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentService.isActive
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  }`}>
                  {currentService.isActive ? "Active" : "Inactive"}
                </span>
                {currentService.popular && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    Popular
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            {currentCategory ? (
              <ServiceForm
                categoryId={currentService.categoryId}
                category={currentCategory as Category}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                mode="edit"
                service={currentService}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Loading category information...
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default EditServicePage;
