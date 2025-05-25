// app/dashboard/categories/[id]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useCategories } from "@/hooks/useCategory";
import { CategoryDetailView } from "../CategoryDetailView";

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const {
    selectedCategory,
    loading,
    error,
    loadCategory,
    clearError,
    getCategoryById,
  } = useCategories();

  // Load category details on mount or when categoryId changes
  React.useEffect(() => {
    if (categoryId) {
      // First check if we already have the category in our state
      const existingCategory = getCategoryById(categoryId);
      if (existingCategory) {
        // If we have basic category data, fetch with services for detailed view
        loadCategory(categoryId, true);
      } else {
        // If we don't have the category, fetch it
        loadCategory(categoryId, true);
      }
    }
  }, [categoryId, loadCategory, getCategoryById]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Category
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              loadCategory(categoryId, true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-600">
            The category you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return <CategoryDetailView category={selectedCategory} />;
}
