// src/app/admin/categories/[id]/edit/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategory";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/store/type/service-categories";
import CategoryForm from "../../CategoryFormUi";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const {
    selectedCategory,
    loadCategory,
    updateCategory,
    updateLoading,
    error,
    clearError,
    loading: categoryLoading,
  } = useCategories();

  // Load category data on mount
  useEffect(() => {
    if (categoryId) {
      loadCategory(categoryId);
    }
  }, [categoryId, loadCategory]);

  const handleSubmit = async (data: CreateCategoryInput) => {
    if (!selectedCategory?.id) {
      throw new Error("Category ID is required for update");
    }

    try {
      const updateData: UpdateCategoryInput = {
        id: selectedCategory.id,
        ...data,
      };

      await updateCategory(updateData);
      router.push("/admin");
    } catch (err) {
      console.error("Failed to update category:", err);
      throw err; // Re-throw to let the form component handle it
    }
  };

  // Show loading state while fetching category data
  if (categoryLoading || !selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading category...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CategoryForm
      mode="edit"
      initialData={
        selectedCategory
          ? {
              ...selectedCategory,
              serviceIds:
                "serviceIds" in selectedCategory
                  ? selectedCategory.serviceIds
                  : selectedCategory.services?.map(
                      (s: { id: string }) => s.id
                    ) ?? [],
            }
          : undefined
      }
      onSubmit={handleSubmit}
      isLoading={updateLoading}
      error={error}
      onClearError={clearError}
      backUrl="/admin"
    />
  );
}
