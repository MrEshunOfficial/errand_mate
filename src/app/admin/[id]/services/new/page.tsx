// src/app/admin/[categoryId]/services/new/page.tsx
"use client";

import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
=======
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Lightbulb, Loader2 } from "lucide-react";
>>>>>>> b34fba331432a112d1e7e80680994ea5d87e1d12

import { useServices } from "@/hooks/useServices";
import { Category, CreateServiceInput } from "@/store/type/service-categories";
import { createService } from "@/store/slices/service-slice"; // Import the actual thunk

import { useCategories } from "@/hooks/useCategory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CreateServiceFormData,
  createServiceFormSchema,
  transformToCreateServiceInput,
} from "./service-shema";
import PageHeader from "./PageHeader";
import LoadingSpinner from "./LoadingSpiner";
import ErrorMessage from "./ErrorMessage";
import CreateServiceForm from "./form-components/CreateServiceForm";

<<<<<<< HEAD
const CreateServicePage: React.FC = () => {
=======
// Enhanced Zod validation schema
const servicePricingSchema = z.object({
  basePrice: z
    .number()
    .min(0.01, "Base price must be at least $0.01")
    .max(999999, "Base price must be reasonable"),
  currency: z.string().min(1, "Currency is required"),
  percentageCharge: z
    .number()
    .min(0, "Percentage charge cannot be negative")
    .max(100, "Percentage charge cannot exceed 100%")
    .optional(),
  additionalFees: z
    .array(
      z.object({
        name: z.string().min(1, "Fee name is required"),
        amount: z.number().min(0, "Fee amount cannot be negative"),
        description: z.string().optional(),
      })
    )
    .optional(),
  pricingNotes: z
    .string()
    .max(1000, "Pricing notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

const serviceSchema = z.object({
  title: z
    .string()
    .min(1, "Service title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  longDescription: z
    .string()
    .max(2000, "Long description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, "Category ID is required"),
  icon: z.string().min(1, "Service icon is required").trim(),
  pricing: servicePricingSchema,
  popular: z.boolean(),
  isActive: z.boolean(),
  tags: z
    .array(z.string().min(2, "Tag must be at least 2 characters"))
    .optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

// Updated interface to match Next.js 15 requirements
interface AddServicePageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function AddServicePage({ params }: AddServicePageProps) {
>>>>>>> b34fba331432a112d1e7e80680994ea5d87e1d12
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

<<<<<<< HEAD
  // Hooks
  const { createNewService, error: serviceError, resetErrors } = useServices();
=======
  // State to store resolved params
  const [categoryId, setCategoryId] = useState<string>("");
  const [paramsLoaded, setParamsLoaded] = useState(false);

  // Use the custom services hook
  const { loading, error, createNewService, resetErrors } = useServices();

  // Redux state for categories (still using direct selector since there's no category hook shown)
>>>>>>> b34fba331432a112d1e7e80680994ea5d87e1d12
  const {
    selectedCategory,
    loadCategory,
    getCategoryById,
    loading: categoryLoading,
    error: categoryError,
  } = useCategories();

<<<<<<< HEAD
  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
=======
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      categoryId: "", // Will be set once params are resolved
      icon: "",
      pricing: {
        basePrice: 0.01,
        currency: "USD",
        percentageCharge: 0,
        additionalFees: [],
        pricingNotes: "",
      },
      popular: false,
      isActive: true,
      tags: [],
    },
  });
>>>>>>> b34fba331432a112d1e7e80680994ea5d87e1d12

  // Get current category
  const currentCategory = selectedCategory || getCategoryById(categoryId);

<<<<<<< HEAD
  // Effects
  useEffect(() => {
    if (!categoryId) {
      toast.error("Category ID is required");
      router.push("/admin");
      return;
    }
=======
  // Resolve params in Next.js 15
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setCategoryId(resolvedParams.categoryId);
        // Update form with categoryId once we have it
        form.setValue("categoryId", resolvedParams.categoryId);
        setParamsLoaded(true);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    resolveParams();
  }, [params, form]);

  // Load category data when categoryId is available
  useEffect(() => {
    if (categoryId && paramsLoaded) {
      dispatch(fetchCategoryById({ id: categoryId, withServices: false }));
    }
  }, [categoryId, paramsLoaded, dispatch]);
>>>>>>> b34fba331432a112d1e7e80680994ea5d87e1d12

    // Load category if not already loaded
    if (!currentCategory && !categoryLoading) {
      loadCategory(categoryId, false);
    }
  }, [categoryId, currentCategory, categoryLoading, loadCategory, router]);

  useEffect(() => {
    // Clear errors when component mounts
    return () => {
      resetErrors();
    };
  }, [resetErrors]);

  // Handlers
  const handleFormSubmit = async (formData: CreateServiceFormData) => {
    try {
      setIsSubmitting(true);

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
        toast.error(`Please fix the form errors: ${errorMessages}`);
        return;
      }

      // Ensure categoryId is set
      const serviceInput: CreateServiceInput = {
        ...transformToCreateServiceInput(validationResult.data),
        categoryId,
      };

      // Create service
      const result = await createNewService(serviceInput);

      // Use the actual thunk for type checking
      if (createService.fulfilled.match(result)) {
        toast.success("Service created successfully");
        router.push(`/admin/${categoryId}/services`);
      } else {
        throw new Error(
          (result.payload as string) || "Failed to create service"
        );
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create service"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/${categoryId}`);
  };

  const handleGoBack = () => {
    router.back();
  };

<<<<<<< HEAD
  // Loading states
=======
  // Loading state for params resolution
  if (!paramsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for category
>>>>>>> b34fba331432a112d1e7e80680994ea5d87e1d12
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
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              Cancel
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="mt-8">
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/10 transition-colors duration-200">
          {/* Category Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <div className="flex items-center gap-3">
              {currentCategory.icon && (
                <div className="text-2xl filter dark:brightness-110">
                  {currentCategory.icon}
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

          {/* Service Error Display */}
          {serviceError && (
            <div className="mb-6">
              <ErrorMessage
                title="Service Creation Error"
                message={
                  typeof serviceError === "string"
                    ? serviceError
                    : JSON.stringify(serviceError)
                }
                onRetry={resetErrors}
                retryLabel="Dismiss"
              />
            </div>
          )}

          {/* Form Container - Form component will be imported here later */}
          <div className="space-y-6">
            <CreateServiceForm
              categoryId={categoryId}
              category={currentCategory as Category}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              defaultValues={{
                categoryId,
                isActive: true,
                popular: false,
                pricing: {
                  basePrice: 0,
                  currency: "USD",
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateServicePage;
