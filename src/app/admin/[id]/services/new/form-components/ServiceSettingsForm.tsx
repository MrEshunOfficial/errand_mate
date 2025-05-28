// src/components/admin/services/ServiceSettingsForm.tsx
"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Settings,
  Star,
  Eye,
  EyeOff,
  Tag,
  Plus,
  X,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CreateServiceFormData } from "../service-shema";

interface ServiceSettingsFormProps {
  form: UseFormReturn<CreateServiceFormData>;
  onStepComplete?: () => void;
}

const ServiceSettingsForm: React.FC<ServiceSettingsFormProps> = ({
  form,
  onStepComplete,
}) => {
  const [newTag, setNewTag] = useState("");
  const [tagError, setTagError] = useState("");

  // Watch form values
  const isActive = form.watch("isActive");
  const popular = form.watch("popular");
  const tags = form.watch("tags") || [];

  // Handle adding new tag
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();

    if (!trimmedTag) {
      setTagError("Tag cannot be empty");
      return;
    }

    if (trimmedTag.length > 30) {
      setTagError("Tag must be less than 30 characters");
      return;
    }

    if (tags.includes(trimmedTag)) {
      setTagError("Tag already exists");
      return;
    }

    if (tags.length >= 10) {
      setTagError("Maximum 10 tags allowed");
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    form.setValue("tags", updatedTags, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setNewTag("");
    setTagError("");
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    form.setValue("tags", updatedTags, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Check if step is complete
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "popular" || name === "isActive" || name === "tags") {
        const hasErrors =
          form.formState.errors.popular ||
          form.formState.errors.isActive ||
          form.formState.errors.tags;

        if (!hasErrors && onStepComplete) {
          onStepComplete();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onStepComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Service Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure visibility and additional settings for your service
        </p>
      </div>

      {/* Service Status */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <FormLabel className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Active Service
                    </FormLabel>
                  </div>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    When enabled, this service will be visible to customers and
                    available for booking
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-green-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Popular Service */}
          <FormField
            control={form.control}
            name="popular"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Star
                      className={`h-4 w-4 ${
                        popular
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-400"
                      }`}
                    />
                    <FormLabel className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Popular Service
                    </FormLabel>
                    {popular && (
                      <Badge
                        variant="default"
                        className="bg-yellow-500 text-yellow-900 text-xs"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    Mark this service as popular to highlight it in listings and
                    search results
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Summary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-gray-400 text-white"
                  }
                >
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {popular && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    Featured as Popular
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Tags */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Service Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Tags (Optional)
                </FormLabel>
                <FormDescription className="text-gray-500 dark:text-gray-400">
                  Add relevant tags to help customers find your service. Maximum
                  10 tags allowed.
                </FormDescription>

                {/* Tag Input */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={newTag}
                      onChange={(e) => {
                        setNewTag(e.target.value);
                        setTagError("");
                      }}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Enter a tag (e.g., quick, professional, affordable)"
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      maxLength={30}
                    />
                    {tagError && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {tagError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || tags.length >= 10}
                    className="border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Tags ({tags.length}/10)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 group hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:bg-blue-300 dark:hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tag Suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-600">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Tag Suggestions
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Popular tags that help customers find services like yours:
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "quick",
                    "professional",
                    "affordable",
                    "premium",
                    "experienced",
                    "certified",
                    "reliable",
                    "flexible",
                  ].map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer border-blue-300 dark:border-blue-500 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors text-xs"
                      onClick={() => {
                        if (!tags.includes(suggestion) && tags.length < 10) {
                          const updatedTags = [...tags, suggestion];
                          form.setValue("tags", updatedTags, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert className="border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Important:</strong> Services marked as inactive will not be
          visible to customers. Popular services will be highlighted in search
          results and featured sections to increase visibility.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ServiceSettingsForm;
