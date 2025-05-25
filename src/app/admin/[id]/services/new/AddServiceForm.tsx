// src/components/admin/services/AddServiceForm.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, FormikHelpers } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BasicInfoSection, PricingSection } from "./BasicInformation";

// Types
interface AdditionalFee {
  name: string;
  amount: number;
  type: "fixed" | "percentage";
}

interface ServiceFormData {
  title: string;
  description: string;
  longDescription: string;
  categoryId: string;
  icon: string;
  pricing: {
    basePrice: number;
    currency: "USD" | "EUR" | "GBP";
    percentageCharge: number;
    additionalFees: AdditionalFee[];
    pricingNotes: string;
  };
  popular: boolean;
  isActive: boolean;
  tags: string[];
}

// Validation Schema using Zod
const serviceValidationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),

  longDescription: z
    .string()
    .max(2000, "Long description must be less than 2000 characters")
    .optional()
    .or(z.literal("")),

  categoryId: z.string().min(1, "Category ID is required"),

  icon: z.string().min(1, "Icon is required"),

  pricing: z.object({
    basePrice: z
      .number()
      .min(0.01, "Base price must be at least $0.01")
      .max(999999, "Base price must be reasonable"),

    currency: z.enum(["USD", "EUR", "GBP"], {
      errorMap: () => ({ message: "Invalid currency" }),
    }),

    percentageCharge: z
      .number()
      .min(0, "Percentage charge cannot be negative")
      .max(100, "Percentage charge cannot exceed 100%"),

    additionalFees: z.array(
      z.object({
        name: z.string().min(1, "Fee name is required"),
        amount: z.number().min(0, "Fee amount cannot be negative"),
        type: z.enum(["fixed", "percentage"], {
          errorMap: () => ({ message: "Invalid fee type" }),
        }),
      })
    ),

    pricingNotes: z
      .string()
      .max(1000, "Pricing notes must be less than 1000 characters")
      .optional()
      .or(z.literal("")),
  }),

  popular: z.boolean(),
  isActive: z.boolean(),

  tags: z.array(z.string().min(2, "Tag must be at least 2 characters")),
});

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

  // Initial form values
  const initialValues: ServiceFormData = {
    title: "",
    description: "",
    longDescription: "",
    categoryId: categoryId || "",
    icon: "",
    pricing: {
      basePrice: 0.01,
      currency: "USD" as const,
      percentageCharge: 0,
      additionalFees: [],
      pricingNotes: "",
    },
    popular: false,
    isActive: true,
    tags: [],
  };

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
      dispatch(clearServiceErrors());
    };
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = async (
    values: ServiceFormData,
    { setSubmitting, setFieldError, setStatus }: FormikHelpers<ServiceFormData>
  ): Promise<void> => {
    try {
      setStatus(null); // Clear any previous status

      // Transform data if needed before sending to API
      const serviceData = {
        ...values,
        pricing: {
          ...values.pricing,
          additionalFees: values.pricing.additionalFees || [],
        },
      };

      await dispatch(createService(serviceData)).unwrap();
      router.push(`/admin/${categoryId}/services`);
    } catch (error: any) {
      console.error("Failed to create service:", error);

      // Handle specific field errors if your API returns them
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setFieldError(field, message as string);
        });
      } else {
        // Set general error status
        setStatus({
          type: "error",
          message:
            error.message || "Failed to create service. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
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

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(serviceValidationSchema)}
        onSubmit={handleSubmit}
        enableReinitialize={true}>
        {({ values, setFieldValue, isSubmitting, errors, touched, status }) => (
          <Form className="space-y-8">
            {/* Status Error Display */}
            {status?.type === "error" && (
              <Alert variant="destructive">
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BasicInfoSection
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                />
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <PricingSection
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                />
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
                    checked={values.popular}
                    onCheckedChange={(checked: boolean) =>
                      setFieldValue("popular", checked)
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
                    checked={values.isActive}
                    onCheckedChange={(checked: boolean) =>
                      setFieldValue("isActive", checked)
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
                disabled={isSubmitting}
                className="min-w-[100px]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || serviceLoading.create}
                className="min-w-[120px]">
                {isSubmitting || serviceLoading.create ? (
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
          </Form>
        )}
      </Formik>
    </div>
  );
};
