// src/components/admin/services/ServiceBasicInfoForm.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Category } from "@/store/type/service-categories";
import { CreateServiceFormData } from "../service-shema";
import { COMMON_ICONS } from "@/lib/utils/CommonIcons";

interface ServiceBasicInfoFormProps {
  form: UseFormReturn<CreateServiceFormData>;
  category: Category;
  onStepComplete: () => void;
}

const ServiceBasicInfoForm: React.FC<ServiceBasicInfoFormProps> = ({
  form,
  category,
  onStepComplete,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<{
    emoji: string;
    label: string;
  } | null>(() => {
    const iconEmoji = form.getValues("icon");
    if (iconEmoji) {
      const found = COMMON_ICONS.find((icon) => icon.emoji === iconEmoji);
      return found || null;
    }
    return null;
  });

  const [showAllIcons, setShowAllIcons] = useState(false);
  const [hasCompletedStep, setHasCompletedStep] = useState(false);

  // Memoize the onStepComplete callback to prevent unnecessary re-renders
  const memoizedOnStepComplete = useCallback(onStepComplete, [onStepComplete]);

  // Watch form values for validation
  const title = form.watch("title");
  const description = form.watch("description");

  useEffect(() => {
    // Check if step should be completed
    const isStepComplete = Boolean(
      title && description && title.length > 0 && description.length > 0
    );

    // Only call onStepComplete if the step is complete and hasn't been completed before
    if (isStepComplete && !hasCompletedStep) {
      setHasCompletedStep(true);
      memoizedOnStepComplete();
    } else if (!isStepComplete && hasCompletedStep) {
      // Reset completion state if form becomes invalid
      setHasCompletedStep(false);
    }
  }, [title, description, hasCompletedStep, memoizedOnStepComplete]);

  const handleIconSelect = useCallback(
    (icon: { emoji: string; label: string }) => {
      setSelectedIcon(icon);
      form.setValue("icon", icon.emoji, { shouldValidate: true });
    },
    [form]
  );

  const handleIconRemove = useCallback(() => {
    setSelectedIcon(null);
    form.setValue("icon", "", { shouldValidate: true });
  }, [form]);

  const displayedIcons = showAllIcons
    ? COMMON_ICONS
    : COMMON_ICONS.slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Category Context */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          {category.icon && <div className="text-2xl">{category.icon}</div>}
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Creating service for: {category.name}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {category.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Service Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium text-gray-900 dark:text-gray-100">
              Service Title *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter service title (e.g., Professional House Cleaning)"
                {...field}
                value={field.value || ""}
                className="text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                maxLength={100}
              />
            </FormControl>
            <FormDescription className="text-gray-600 dark:text-gray-400">
              A clear, descriptive title for your service. This will be
              displayed to customers.
            </FormDescription>
            <FormMessage className="text-red-600 dark:text-red-400" />
            {field.value && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {field.value.length}/100 characters
              </div>
            )}
          </FormItem>
        )}
      />

      {/* Service Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium text-gray-900 dark:text-gray-100">
              Short Description *
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of what this service includes..."
                {...field}
                value={field.value || ""}
                className="min-h-[100px] border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 resize-none"
                maxLength={500}
              />
            </FormControl>
            <FormDescription className="text-gray-600 dark:text-gray-400">
              A concise summary that will appear in service listings and
              previews.
            </FormDescription>
            <FormMessage className="text-red-600 dark:text-red-400" />
            {field.value && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {field.value.length}/500 characters
              </div>
            )}
          </FormItem>
        )}
      />

      {/* Service Icon */}
      <FormField
        control={form.control}
        name="icon"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium text-gray-900 dark:text-gray-100">
              Service Icon
              <Badge variant="secondary" className="ml-2 text-xs">
                Optional
              </Badge>
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                {/* Selected Icon Display */}
                {selectedIcon && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-2xl">{selectedIcon.emoji}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedIcon.label}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleIconRemove}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Icon Selection Grid */}
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                  {displayedIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleIconSelect(icon)}
                      className={`p-3 text-xl rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        selectedIcon && selectedIcon.emoji === icon.emoji
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                      }`}
                    >
                      {icon.emoji}
                    </button>
                  ))}
                </div>

                {/* Show More/Less Icons */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllIcons(!showAllIcons)}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {showAllIcons ? "Show Less Icons" : "Show More Icons"}
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormDescription className="text-gray-600 dark:text-gray-400">
              Choose an icon that represents your service. This helps customers
              quickly identify your service.
            </FormDescription>
            <FormMessage className="text-red-600 dark:text-red-400" />
          </FormItem>
        )}
      />

      {/* Form Status Indicator */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              form.formState.errors.title || form.formState.errors.description
                ? "bg-red-500"
                : title && description
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          />
          <span className="text-gray-600 dark:text-gray-400">
            {form.formState.errors.title || form.formState.errors.description
              ? "Please fix the errors above"
              : title && description
              ? "Basic information completed"
              : "Complete required fields to continue"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceBasicInfoForm;
