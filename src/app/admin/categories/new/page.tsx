// app/admin/categories/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";

import { useCategories } from "@/hooks/useCategory";
import { CreateCategoryInput } from "@/store/type/service-categories";

// Zod validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters")
    .trim(),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  icon: z.string().optional().or(z.literal("")),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const COMMON_ICONS = [
  { emoji: "🏠", label: "Home" },
  { emoji: "🚗", label: "Automotive" },
  { emoji: "💻", label: "Technology" },
  { emoji: "🛠️", label: "Repair" },
  { emoji: "🧹", label: "Cleaning" },
  { emoji: "🎨", label: "Art & Design" },
  { emoji: "📱", label: "Mobile" },
  { emoji: "🍽️", label: "Food & Dining" },
  { emoji: "👔", label: "Professional" },
  { emoji: "💄", label: "Beauty" },
  { emoji: "🌱", label: "Garden" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "📚", label: "Education" },
  { emoji: "🎵", label: "Music" },
  { emoji: "📷", label: "Photography" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🏥", label: "Healthcare" },
  { emoji: "⚖️", label: "Legal" },
  { emoji: "💰", label: "Finance" },
  { emoji: "🎯", label: "Marketing" },
  { emoji: "🔧", label: "Tools" },
  { emoji: "🛡️", label: "Security" },
  { emoji: "📊", label: "Analytics" },
  { emoji: "🎭", label: "Entertainment" },
];

export default function AddCategoryPage() {
  const router = useRouter();
  const { createCategory, createLoading, error, clearError } = useCategories();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  const watchedValues = form.watch();
  const selectedIcon = form.watch("icon");

  const onSubmit = async (data: CategoryFormData) => {
    try {
      clearError();

      const categoryInput: CreateCategoryInput = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        icon: data.icon || undefined,
      };

      await createCategory(categoryInput);
      router.push("/admin");
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  const handleIconSelect = (emoji: string) => {
    form.setValue("icon", selectedIcon === emoji ? "" : emoji);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4 -ml-4 text-muted-foreground hover:text-foreground"
          >
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Add New Category
            </h1>
            <p className="text-xl text-muted-foreground">
              Create a new service category to organize your services
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Category Details</CardTitle>
                <CardDescription>
                  Fill in the information below to create your new category
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
                        onClick={clearError}
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
                              disabled={createLoading}
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
                              disabled={createLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="flex justify-between">
                            <span>Optional but recommended for clarity</span>
                            <span className="text-xs">
                              {field.value?.length || 0}/200 characters
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Icon Selection */}
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">
                            Category Icon
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter an emoji or icon"
                              className="h-12 text-base"
                              disabled={createLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a custom emoji or choose from the options
                            below
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Common Icons Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Separator className="flex-1" />
                        <span className="text-sm text-muted-foreground font-medium">
                          Popular Icons
                        </span>
                        <Separator className="flex-1" />
                      </div>

                      <div className="grid grid-cols-8 gap-3">
                        {COMMON_ICONS.map(({ emoji, label }) => (
                          <Button
                            key={emoji}
                            type="button"
                            variant={
                              selectedIcon === emoji ? "default" : "outline"
                            }
                            size="sm"
                            className="h-12 w-12 p-0 text-xl hover:scale-105 transition-transform"
                            onClick={() => handleIconSelect(emoji)}
                            disabled={createLoading}
                            title={label}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        asChild
                        disabled={createLoading}
                      >
                        <Link href="/admin">Cancel</Link>
                      </Button>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={createLoading || !watchedValues.name?.trim()}
                        className="min-w-[140px]"
                      >
                        {createLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Category"
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
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                    {selectedIcon && (
                      <span className="text-2xl">{selectedIcon}</span>
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

                  {watchedValues.name && (
                    <Badge variant="secondary" className="w-fit">
                      {watchedValues.name.length} characters
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
                    <li>• Choose representative icons</li>
                    <li>• Think about user search patterns</li>
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
