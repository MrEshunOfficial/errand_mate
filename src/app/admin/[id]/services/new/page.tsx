// src/app/admin/[categoryId]/services/new/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { useServices } from "@/hooks/useServices";
import { createService } from "@/store/slices/service-slice";
import { useCategories } from "@/hooks/useCategory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

import {
  CreateServiceFormData,
  createServiceFormSchema,
  transformToCreateServiceInput,
} from "./service-shema";

import PageHeader from "./PageHeader";
import LoadingSpinner from "./LoadingSpiner";
import ErrorMessage from "./ErrorMessage";
import { getErrorMessage } from "@/lib/utils/serviceTransform";
import ServiceForm from "./form-components/ServicForm";
import { Category, CreateServiceInput } from "@/store/type/service-categories";

const CreateServicePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  // Hooks
  const { createNewService, resetErrors } = useServices();
  const {
    selectedCategory,
    loadCategory,
    getCategoryById,
    loading: categoryLoading,
    error: categoryError,
  } = useCategories();

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get current category with proper typing
  const toCategory = (cat: unknown): Category | undefined => {
    if (!cat || typeof cat !== "object") return undefined;
    // If already Category (has serviceIds), return as is
    if (Array.isArray((cat as Category).serviceIds)) return cat as Category;
    // If CategoryWithServices, map to Category
    if (Array.isArray((cat as { services?: { id: string }[] }).services)) {
      const services = (cat as { services: { id: string }[] }).services;
      return {
        ...(cat as object),
        serviceIds: services.map((s) => s.id),
        serviceCount: services.length,
      } as Category;
    }
    return undefined;
  };
  const currentCategory: Category | undefined =
    toCategory(selectedCategory) || toCategory(getCategoryById(categoryId));

  // Effects
  useEffect(() => {
    if (!categoryId) {
      toast.error("Category ID is required");
      router.push("/admin");
      return;
    }

    // Load category if not already loaded
    if (!currentCategory && !categoryLoading) {
      loadCategory(categoryId, false);
    }
  }, [categoryId, currentCategory, categoryLoading, loadCategory, router]);

  // Clear errors when component mounts
  useEffect(() => {
    resetErrors();
    setFormError(null);

    return () => {
      resetErrors();
      setFormError(null);
    };
  }, [resetErrors]);

  // Handlers
  const handleFormSubmit = async (formData: CreateServiceFormData) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      // Clear any previous errors before attempting to create
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

      // Create service input with proper typing
      const serviceInput: CreateServiceInput = {
        ...transformToCreateServiceInput(validationResult.data),
        categoryId,
      };

      console.log("Creating service with input:", serviceInput);

      // Create service
      const result = await createNewService(serviceInput);

      // Check if the action was fulfilled
      if (createService.fulfilled.match(result)) {
        toast.success("Service created successfully");
        router.push(`/admin/services/${categoryId}`);
      } else if (createService.rejected.match(result)) {
        // Handle rejected action
        const errorMessage = getErrorMessage(result.payload);
        setFormError(errorMessage);
        toast.error(errorMessage);
      } else {
        // Handle unexpected result
        const errorMessage = "Failed to create service";
        setFormError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating service:", error);
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
    router.push(`/admin/${categoryId}`);
  };

  const handleGoBack = () => {
    resetErrors();
    setFormError(null);
    router.back();
  };

  // Loading states
  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error states
  if (categoryError) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <ErrorMessage
          title="Failed to load category"
          message={categoryError}
          onRetry={() => loadCategory(categoryId, false)}
        />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
        <ErrorMessage
          title="Category not found"
          message="The requested category could not be found."
          onRetry={handleGoBack}
          retryLabel="Go Back"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
      {/* Page Header */}
      <PageHeader
        title="Create New Service"
        subtitle={`Add a new service to ${currentCategory.name} category`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Categories", href: `/admin/${currentCategory.id}` },
          {
            label: currentCategory.name,
            href: `/admin/${categoryId}/services`,
          },
          { label: "New Service", href: "#", current: true },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
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
          {/* Category Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <div className="flex items-center gap-3">
              {currentCategory.catImage && (
                <div className="text-2xl filter dark:brightness-110">
                  <img
                    src={currentCategory.catImage.url}
                    alt={currentCategory.catImage.alt}
                    className="w-8 h-8 object-cover rounded"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {currentCategory.name}
                </h3>
                {currentCategory.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="space-y-6">
            <ServiceForm
              categoryId={categoryId}
              category={currentCategory}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              mode="create"
              defaultValues={{
                categoryId,
                isActive: true,
                popular: false,
              }}
            />
          </div>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default CreateServicePage;
