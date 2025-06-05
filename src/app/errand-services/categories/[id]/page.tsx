// app/errand-services/categories/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Users } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/store/type/service-categories";

export default function CategoryPage(): JSX.Element {
  const params = useParams();
  const categoryId = params.id as string;
  const {
    categories,
    getCategoryById,
    selectedCategory,
    loading: hookLoading,
  } = useCategories();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch category data
  useEffect(() => {
    const fetchCategoryData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Try to get category from existing categories first
        const existingCategory = categories.find(
          (cat) => cat._id.toString() === categoryId
        );

        if (existingCategory) {
          setCategory(existingCategory);
        } else {
          // Fetch specific category if not in the list
          const result = await getCategoryById?.(categoryId);

          // Use unwrapResult to properly extract the payload
          if (result) {
            try {
              const categoryData = unwrapResult(result);
              setCategory(categoryData);
            } catch (error) {
              console.error("Failed to unwrap category result:", error);
              setCategory(null);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId, categories, getCategoryById]);

  // Alternative approach: Use selectedCategory from Redux store
  // This would be cleaner if your Redux slice sets selectedCategory when fetching by ID
  useEffect(() => {
    if (selectedCategory && selectedCategory._id.toString() === categoryId) {
      setCategory(selectedCategory);
      setLoading(false);
    }
  }, [selectedCategory, categoryId]);

  if (loading || hookLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton - Mobile Header */}
        <div className="space-y-4 lg:hidden">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="h-6 sm:h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading skeleton - Content */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
            <div className="grid gap-4 sm:gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-2/3 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Header - Matches layout spacing and alignment */}
      <div className="space-y-4 lg:hidden">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight break-words">
              {category?.categoryName || "Category"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {category?.description || "Explore services in this category"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0 bg-muted/50 rounded-full px-3 py-1">
            <Users className="h-4 w-4" />
            <span className="font-medium">
              {category?.serviceCount || 0} services
            </span>
          </div>
        </div>
      </div>

      {/* Category Information Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              Category Information
              <div className="h-1 w-8 bg-primary rounded-full" />
            </h2>

            <div className="grid gap-4 sm:gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Category Name
                  </label>
                  <p className="text-base font-semibold break-words">
                    {category?.categoryName || "Loading..."}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Services
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-semibold">
                      {category?.serviceCount || 0} services
                    </p>
                  </div>
                </div>
              </div>

              {category?.description && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-md p-3">
                    {category.description}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Category ID
                </label>
                <code className="relative rounded bg-muted px-3 py-2 font-mono text-sm font-medium break-all block">
                  {categoryId}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section Placeholder */}
      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 sm:p-8 text-center bg-muted/20">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-semibold">
            Services will be displayed here
          </h3>
          <p className="mb-4 mt-2 text-xs sm:text-sm text-muted-foreground px-4 leading-relaxed">
            This section will show all services available in the{" "}
            <strong className="break-words text-foreground">
              {category?.categoryName || "selected"}
            </strong>{" "}
            category. Services are coming soon!
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Ready to display services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
