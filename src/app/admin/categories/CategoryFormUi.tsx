// components/admin/CategoryFormUi.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Lightbulb, Loader2, Upload } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Category, CreateCategoryInput } from "@/store/type/service-categories";
import ImageUpload from "@/components/ui/Image-upload";
import { Separator } from "@radix-ui/react-dropdown-menu";

// Zod validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  catImageUrl: z
    .string()
    .optional()
    .or(z.literal("")),
  catImageAlt: z
    .string()
    .max(100, "Alt text must be less than 100 characters")
    .optional()
    .or(z.literal("")),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: Category;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  backUrl?: string;
}

export default function CategoryForm({
  mode,
  initialData,
  onSubmit,
  isLoading,
  error,
  onClearError,
  backUrl = "/admin",
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      catImageUrl: initialData?.catImage?.url || "",
      catImageAlt: initialData?.catImage?.alt || "",
    },
  });

  const watchedValues = form.watch();
  const imageUrl = form.watch("catImageUrl");

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      onClearError();

      const categoryInput: CreateCategoryInput = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        catImage: data.catImageUrl?.trim()
          ? {
              url: data.catImageUrl.trim(),
              alt: data.catImageAlt?.trim() || data.name.trim(),
            }
          : undefined,
      };

      await onSubmit(categoryInput);
    } catch (err) {
      console.error(`Failed to ${mode} category:`, err);
    }
  };

  const handleImageChange = (url: string | null) => {
    form.setValue("catImageUrl", url || "");
    if (!url) {
      form.setValue("catImageAlt", "");
    }
  };

  const handleAltTextChange = (altText: string) => {
    form.setValue("catImageAlt", altText);
  };

  const title = mode === "create" ? "Add New Category" : "Edit Category";
  const subtitle =
    mode === "create"
      ? "Create a new service category to organize your services"
      : "Update the category information";
  const submitText = mode === "create" ? "Create Category" : "Update Category";
  const loadingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
            <Link href={backUrl}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-xl text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Category Details</CardTitle>
                <CardDescription>
                  {mode === "create"
                    ? "Fill in the information below to create your new category"
                    : "Update the category information below"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Error Display */}
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription className="flex items-center justify-between">
                      <span>{error}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearError}
                        className="h-auto p-0 text-destructive hover:text-destructive">
                        ×
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8">
                    {/* Category Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Category Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter category name"
                              className="h-12 text-base"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Choose a clear, descriptive name that users will
                            understand
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a brief description of this category"
                              className="min-h-[100px] text-base resize-none"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="flex justify-between">
                            <span>Optional but recommended for clarity</span>
                            <span className="text-xs">
                              {field.value?.length || 0}/500 characters
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category Image Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Separator className="flex-1" />
                        <span className="text-sm text-muted-foreground font-medium">
                          Category Image
                        </span>
                        <Separator className="flex-1" />
                      </div>

                      {/* Image Upload */}
                      <FormField
                        control={form.control}
                        name="catImageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">
                              Category Image
                            </FormLabel>
                            <FormControl>
                              <ImageUpload
                                value={field.value}
                                onChange={handleImageChange}
                                onAltTextChange={handleAltTextChange}
                                altText={watchedValues.catImageAlt}
                                disabled={isLoading}
                                showAltTextInput={!!field.value}
                                placeholder="Click to upload category image or drag and drop"
                                width={400}
                                height={200}
                                maxSizeInMB={5}
                                acceptedFormats={[
                                  "image/jpeg",
                                  "image/jpg",
                                  "image/png",
                                  "image/webp"
                                ]}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload an image for the category (recommended: 400x300px, max 5MB)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        asChild
                        disabled={isLoading}>
                        <Link href={backUrl}>Cancel</Link>
                      </Button>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading || !watchedValues.name?.trim()}
                        className="min-w-[140px]">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {loadingText}
                          </>
                        ) : (
                          submitText
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  See how your category will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imageUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={
                          watchedValues.catImageAlt ||
                          watchedValues.name ||
                          "Category image"
                        }
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover border"
                        onError={() => {}}
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">
                      {watchedValues.name || "Category Name"}
                    </div>
                    {watchedValues.description && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {watchedValues.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {watchedValues.name && (
                    <Badge variant="secondary" className="text-xs">
                      {watchedValues.name.length} chars
                    </Badge>
                  )}
                  {imageUrl && (
                    <Badge variant="outline" className="text-xs">
                      <Upload className="w-3 h-3 mr-1" />
                      Image uploaded
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <p className="font-medium">Best Practices:</p>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Use clear, descriptive names</li>
                    <li>• Keep descriptions brief but informative</li>
                    <li>• Upload high-quality images (recommended: 400x300px)</li>
                    <li>• Always provide alt text for accessibility</li>
                    <li>• Think about user search patterns</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Image Guidelines:</p>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Supported formats: JPG, PNG, WebP</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Drag & drop or click to upload</li>
                    <li>• Images are automatically optimized</li>
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