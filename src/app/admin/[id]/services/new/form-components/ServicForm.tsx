// src/components/admin/services/ServiceForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import ServiceBasicInfoForm from "./ServiceBasicInfoForm";
import ServicePricingForm from "./ServicePricingForm";
import ServiceSettingsForm from "./ServiceSettingsForm";
import { Category, Service } from "@/store/type/service-categories";
import {
  CreateServiceFormData,
  createServiceFormSchema,
  createServiceFormDefaults,
} from "../service-shema";

interface ServiceFormProps {
  categoryId: string;
  category: Category;
  onSubmit: (data: CreateServiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  service?: Service; // Optional for edit mode
  defaultValues?: Partial<CreateServiceFormData>;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  categoryId,
  category,
  onSubmit,
  onCancel,
  isSubmitting,
  mode,
  service,
  defaultValues,
}) => {
  // Determine form defaults based on mode
  const getFormDefaults = (): CreateServiceFormData => {
    const baseDefaults = {
      ...createServiceFormDefaults,
      categoryId,
      ...defaultValues,
    };

    if (mode === "edit" && service) {
      return {
        title: service.title,
        description: service.description,
        categoryId: service.categoryId,
        isActive: service.isActive,
        popular: service.popular || false,
        pricing: {
          basePrice: service.pricing?.basePrice || 0,
          currency: service.pricing?.currency || "USD",
        },
        // Add other form fields as needed
        longDescription: service.longDescription || "",
        icon: service.icon || "",
        tags: service.tags || [],
      };
    }

    return baseDefaults;
  };

  // Form setup with react-hook-form and zod validation
  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceFormSchema),
    defaultValues: getFormDefaults(),
    mode: "onChange",
  });

  // Local state for form sections
  const [currentStep, setCurrentStep] = useState<
    "basic" | "pricing" | "settings"
  >("basic");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Handle form submission
  const handleFormSubmit: SubmitHandler<CreateServiceFormData> = async (
    data
  ) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Failed to ${mode} service. Please try again.`);
    }
  };

  // Step navigation handlers
  const handleStepChange = (step: "basic" | "pricing" | "settings") => {
    setCurrentStep(step);
  };

  const handleStepComplete = (step: string) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  // Validation helpers
  const isStepValid = (step: string): boolean => {
    const { formState } = form;

    switch (step) {
      case "basic":
        return (
          !formState.errors.title &&
          !formState.errors.description &&
          !formState.errors.longDescription &&
          !formState.errors.icon
        );
      case "pricing":
        return !formState.errors.pricing;
      case "settings":
        return (
          !formState.errors.popular &&
          !formState.errors.isActive &&
          !formState.errors.tags
        );
      default:
        return true;
    }
  };

  const canProceedToNext = (): boolean => {
    return isStepValid(currentStep);
  };

  // Step navigation
  const handleNext = () => {
    if (!canProceedToNext()) {
      toast.error("Please complete all required fields before proceeding");
      return;
    }

    handleStepComplete(currentStep);

    if (currentStep === "basic") {
      setCurrentStep("pricing");
    } else if (currentStep === "pricing") {
      setCurrentStep("settings");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "settings") {
      setCurrentStep("pricing");
    } else if (currentStep === "pricing") {
      setCurrentStep("basic");
    }
  };

  // Step indicator component
  const StepIndicator = () => {
    const steps = [
      { key: "basic", label: "Basic Info", icon: "📝" },
      { key: "pricing", label: "Pricing", icon: "💰" },
      { key: "settings", label: "Settings", icon: "⚙️" },
    ];

    return (
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = completedSteps.has(step.key);
          const isValid = isStepValid(step.key);

          return (
            <React.Fragment key={step.key}>
              <div
                className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : isCompleted
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                onClick={() =>
                  handleStepChange(step.key as "basic" | "pricing" | "settings")
                }>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isActive
                      ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : isCompleted
                      ? "border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
                      : isValid
                      ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      : "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                  }`}>
                  {isCompleted ? (
                    <span className="text-green-600 dark:text-green-400">
                      ✓
                    </span>
                  ) : !isValid && step.key !== currentStep ? (
                    <span className="text-red-500 dark:text-red-400">!</span>
                  ) : (
                    <span className="text-sm">{step.icon}</span>
                  )}
                </div>
                <div>
                  <div
                    className={`font-medium text-sm ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                    {step.label}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 transition-colors duration-200 ${
                    completedSteps.has(step.key)
                      ? "bg-green-300 dark:bg-green-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const submitButtonText =
    mode === "create" ? "Create Service" : "Update Service";
  const submittingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <StepIndicator />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === "basic" && (
              <ServiceBasicInfoForm
                form={form}
                category={category}
                onStepComplete={() => handleStepComplete("basic")}
              />
            )}

            {currentStep === "pricing" && (
              <ServicePricingForm
                form={form}
                onStepComplete={() => handleStepComplete("pricing")}
              />
            )}

            {currentStep === "settings" && (
              <ServiceSettingsForm
                form={form}
                onStepComplete={() => handleStepComplete("settings")}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {currentStep !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </Button>

              {currentStep !== "settings" ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedToNext() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className={`text-white min-w-[120px] ${
                    mode === "create"
                      ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {submittingText}
                    </div>
                  ) : (
                    submitButtonText
                  )}
                </Button>
              )}
            </div>
          </div>

          
        </form>
      </Form>
    </div>
  );
};

export default ServiceForm;
