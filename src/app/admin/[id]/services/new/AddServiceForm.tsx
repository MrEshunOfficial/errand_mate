// src/components/admin/services/AddServiceForm.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState, AppDispatch } from "@/store";
import {
  fetchCategoryById,
  clearError as clearCategoryError,
} from "@/store/slices/category-slice";
import {
  createService,
  clearErrors as clearServiceErrors,
} from "@/store/slices/service-slice";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BasicInfoSection } from "./BasicInformation";
import { PricingSection } from "./PricingSection";

import {
  ServiceFormData,
  serviceSchema,
  type AdditionalFee,
} from "./service-schema";

interface AddServiceFormProps {
  categoryId: string;
}

export const AddServiceForm: React.FC<AddServiceFormProps> = ({
  categoryId,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    selectedCategory,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((state: RootState) => state.categories);
  const { loading: serviceLoading, error: serviceError } = useSelector(
    (state: RootState) => state.services
  );

  // Form setup with explicit typing and proper default values
  const form: UseFormReturn<ServiceFormData> = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      categoryId: categoryId || "",
      icon: "",
      pricing: {
        basePrice: 0.01, // Changed to meet minimum requirement
        currency: "USD" as const,
        percentageCharge: 0,
        additionalFees: [] as AdditionalFee[],
        pricingNotes: "",
      },
      popular: false,
      isActive: true,
      tags: [],
    },
  });

  // Load category data when component mounts
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryById({ id: categoryId, withServices: false }));
      form.setValue("categoryId", categoryId);
    }
  }, [categoryId, dispatch, form]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCategoryError());
      dispatch(clearServiceErrors());
    };
  }, [dispatch]);

  // Handle form submission with explicit typing
  const onSubmit = async (data: ServiceFormData): Promise<void> => {
    try {
      // Transform data if needed before sending to API
      const serviceData = {
        ...data,
        // Ensure pricing data is properly formatted
        pricing: {
          ...data.pricing,
          additionalFees: data.pricing.additionalFees || [],
        },
      };

      await dispatch(createService(serviceData)).unwrap();
      router.push(`/admin/${categoryId}/services`);
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  // Handle cancel
  const handleCancel = (): void => {
    router.back();
  };

  if (categoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (categoryError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading category: {categoryError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Info */}
      {selectedCategory && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Adding service to:</div>
            <div className="text-sm font-semibold text-primary">
              {selectedCategory.name}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {serviceError.create && (
        <Alert variant="destructive">
          <AlertDescription>{serviceError.create}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection form={form} />
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PricingSection form={form} />
            </CardContent>
          </Card>

          {/* Service Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Service Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="popular">Popular Service</Label>
                  <div className="text-sm text-muted-foreground">
                    Mark this service as popular to highlight it
                  </div>
                </div>
                <Switch
                  id="popular"
                  checked={form.watch("popular")}
                  onCheckedChange={(checked: boolean) =>
                    form.setValue("popular", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Active Service</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable this service for customers to book
                  </div>
                </div>
                <Switch
                  id="isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked: boolean) =>
                    form.setValue("isActive", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="min-w-[100px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={serviceLoading.create}
              className="min-w-[120px]"
            >
              {serviceLoading.create ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Service
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
