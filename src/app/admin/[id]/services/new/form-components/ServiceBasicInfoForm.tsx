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
import Image from "next/image";

import { Category } from "@/store/type/service-categories";
import { COMMON_ICONS } from "@/lib/utils/CommonIcons";
import { CreateServiceFormData } from "../service-shema";

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
  // Updated to handle serviceImage object structure
  const [selectedIcon, setSelectedIcon] = useState<{
    emoji: string;
    label: string;
  } | null>(() => {
    const serviceImage = form.getValues("serviceImage");
    if (serviceImage?.url) {
      // Check if it's an emoji-based image (for backward compatibility)
      const found = COMMON_ICONS.find(
        (icon) =>
          serviceImage.url === icon.emoji || serviceImage.alt === icon.label
      );
      return found || null;
    }
    return null;
  });

  const [showAllIcons, setShowAllIcons] = useState(false);
  const [hasCompletedStep, setHasCompletedStep] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(() => {
    const serviceImage = form.getValues("serviceImage");
    return serviceImage?.url || "";
  });
  const [imageAlt, setImageAlt] = useState<string>(() => {
    const serviceImage = form.getValues("serviceImage");
    return serviceImage?.alt || "";
  });

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
      // Update serviceImage with emoji as URL and label as alt text
      form.setValue(
        "serviceImage",
        {
          url: icon.emoji,
          alt: icon.label,
        },
        { shouldValidate: true }
      );
      // Clear custom image inputs when icon is selected
      setImageUrl("");
      setImageAlt("");
    },
    [form]
  );

  const handleIconRemove = useCallback(() => {
    setSelectedIcon(null);
    form.setValue("serviceImage", undefined, { shouldValidate: true });
  }, [form]);

  const handleCustomImageChange = useCallback(
    (url: string, alt: string) => {
      if (url && alt) {
        form.setValue("serviceImage", { url, alt }, { shouldValidate: true });
        // Clear selected icon when custom image is used
        setSelectedIcon(null);
      } else if (!url && !alt) {
        form.setValue("serviceImage", undefined, { shouldValidate: true });
      }
    },
    [form]
  );

  const displayedIcons = showAllIcons
    ? COMMON_ICONS
    : COMMON_ICONS.slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Category Context */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          {category.catImage?.url && (
            <Image
              src={category.catImage.url}
              alt={category.catImage.alt}
              className="w-full h-full object-cover"
              width={32}
              height={32}
              style={{ objectFit: "cover" }}
              unoptimized
            />
          )}
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

      {/* Service Image */}
      <FormField
        control={form.control}
        name="serviceImage"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium text-gray-900 dark:text-gray-100">
              Service Image
              <Badge variant="secondary" className="ml-2 text-xs">
                Optional
              </Badge>
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                {/* Current Image Display */}
                {(selectedIcon || (imageUrl && imageAlt)) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    {selectedIcon ? (
                      <>
                        <div className="text-2xl">{selectedIcon.emoji}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Icon: {selectedIcon.label}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 overflow-hidden rounded border">
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            className="w-full h-full object-cover"
                            width={32}
                            height={32}
                            style={{ objectFit: "cover" }}
                            unoptimized
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Custom image: {imageAlt}
                        </div>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleIconRemove}
                      className="ml-auto">
                      Remove
                    </Button>
                  </div>
                )}

                {/* Custom Image Inputs */}
                <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Custom Image
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          handleCustomImageChange(e.target.value, imageAlt);
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alt Text
                      </label>
                      <Input
                        placeholder="Description of the image"
                        value={imageAlt}
                        onChange={(e) => {
                          setImageAlt(e.target.value);
                          handleCustomImageChange(imageUrl, e.target.value);
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  OR
                </div>

                {/* Icon Selection Grid */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Choose from Icons
                  </h4>
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
                        title={icon.label}>
                        {icon.emoji}
                      </button>
                    ))}
                  </div>

                  {/* Show More/Less Icons */}
                  <div className="flex justify-center mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllIcons(!showAllIcons)}
                      className="text-gray-600 dark:text-gray-400">
                      {showAllIcons ? "Show Less Icons" : "Show More Icons"}
                    </Button>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormDescription className="text-gray-600 dark:text-gray-400">
              Choose an icon or provide a custom image URL. This helps customers
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
