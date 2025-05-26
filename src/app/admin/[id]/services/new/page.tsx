// app/admin/categories/[categoryId]/services/new/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Lightbulb, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { RootState, AppDispatch } from "@/store";
import {
  fetchCategoryById,
  clearError as clearCategoryError,
} from "@/store/slices/category-slice";
import { CreateServiceInput } from "@/store/type/service-categories";

// Import the custom hook instead of slice actions
import { useServices } from "@/hooks/useServices";

import { BasicInfoSection } from "./BasicInformation";
import { PricingSection } from "./PricingSection";
import { ServiceSettingsSection } from "./ServiceSettings";
import { Form } from "@/components/ui/form";

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

interface AddServicePageProps {
  params: {
    categoryId: string;
  };
}

export default function AddServicePage({ params }: AddServicePageProps) {
  const { categoryId } = params;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Use the custom services hook
  const { loading, error, createNewService, resetErrors } = useServices();

  // Redux state for categories (still using direct selector since there's no category hook shown)
  const {
    selectedCategory,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((state: RootState) => state.categories);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      categoryId: categoryId,
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

  const watchedValues = form.watch();

  // Load category data when component mounts
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryById({ id: categoryId, withServices: false }));
    }
  }, [categoryId, dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCategoryError());
      resetErrors(); // Use hook method instead of direct dispatch
    };
  }, [dispatch, resetErrors]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      resetErrors(); // Clear previous errors

      const serviceInput: CreateServiceInput = {
        title: data.title.trim(),
        description: data.description.trim(),
        longDescription: data.longDescription?.trim() || undefined,
        categoryId: data.categoryId,
        icon: data.icon.trim(),
        pricing: {
          ...data.pricing,
          pricingNotes: data.pricing.pricingNotes?.trim() || undefined,
        },
        popular: data.popular,
        isActive: data.isActive,
        tags: data.tags?.filter((tag) => tag.trim().length > 0),
      };

      await createNewService(serviceInput).unwrap();
      router.push(`/admin/categories/${categoryId}/services`);
    } catch (err) {
      console.error("Failed to create service:", err);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Loading state
  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading category...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (categoryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading category: {categoryError}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4 -ml-4 text-muted-foreground hover:text-foreground"
          >
            <Link href={`/admin/categories/${categoryId}/services`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Add New Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Create a new service for{" "}
              {selectedCategory?.name || "this category"}
            </p>
          </div>
        </div>

        {/* Category Info */}
        {selectedCategory && (
          <div className="mb-8">
            <Card className="shadow-sm border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  {selectedCategory.icon && (
                    <span className="text-2xl">{selectedCategory.icon}</span>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Adding service to:
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {selectedCategory.name}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Error Display */}
              {error.create && (
                <Alert variant="destructive">
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error.create}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetErrors} // Use hook method
                      className="h-auto p-0 text-destructive hover:text-destructive"
                    >
                      ×
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Basic Information */}
                  <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Enter the core details about your service
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BasicInfoSection
                        form={form}
                        isLoading={loading.create}
                      />
                    </CardContent>
                  </Card>

                  {/* Pricing Information */}
                  <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">
                        Pricing Information
                      </CardTitle>
                      <CardDescription>
                        Set up pricing structure for your service
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PricingSection form={form} isLoading={loading.create} />
                    </CardContent>
                  </Card>

                  {/* Service Settings */}
                  <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">
                        Service Settings
                      </CardTitle>
                      <CardDescription>
                        Configure service visibility and features
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ServiceSettingsSection
                        form={form}
                        isLoading={loading.create}
                      />
                    </CardContent>
                  </Card>

                  {/* Form Actions */}
                  <div className="flex items-center justify-between pt-6 border-t bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleCancel}
                      disabled={loading.create}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={
                        loading.create ||
                        !watchedValues.title?.trim() ||
                        !watchedValues.description?.trim()
                      }
                      className="min-w-[140px]"
                    >
                      {loading.create ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Service"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  See how your service will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-start gap-3">
                      {watchedValues.icon && (
                        <span className="text-2xl mt-1">
                          {watchedValues.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base truncate">
                          {watchedValues.title || "Service Title"}
                        </div>
                        {watchedValues.description && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {watchedValues.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">
                            {watchedValues.pricing?.currency}{" "}
                            {watchedValues.pricing?.basePrice?.toFixed(2) ||
                              "0.00"}
                          </Badge>
                          {watchedValues.popular && (
                            <Badge variant="default">Popular</Badge>
                          )}
                          {!watchedValues.isActive && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {watchedValues.title && (
                      <Badge variant="outline" className="text-xs">
                        {watchedValues.title.length} chars
                      </Badge>
                    )}
                    {watchedValues.tags && watchedValues.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {watchedValues.tags.length} tags
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Lightbulb className="h-5 w-5" />
                  Service Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <p className="font-medium">Best Practices:</p>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Write clear, descriptive titles</li>
                    <li>• Include detailed service descriptions</li>
                    <li>• Set competitive pricing</li>
                    <li>• Use relevant tags for discoverability</li>
                    <li>• Choose appropriate icons</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
