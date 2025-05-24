// app/dashboard/categories/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/store/type/service-categories";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    loadCategories,
    getCategoriesByServiceCount,
    clearError,
  } = useCategories();

  // Load categories on mount
  React.useEffect(() => {
    loadCategories(false, true);
  }, [loadCategories]);

  const handleRetry = () => {
    clearError();
    loadCategories(false, true);
  };

  const sortedCategories = getCategoriesByServiceCount();

  if (loading && categories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Categories
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your service categories and organize your offerings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {categories.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Categories
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {categories.reduce((sum, cat) => sum + (cat.serviceCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Services
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {categories.filter((cat) => (cat.serviceCount || 0) > 0).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Categories
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {Math.round(
              categories.reduce(
                (sum, cat) => sum + (cat.serviceCount || 0),
                0
              ) / Math.max(categories.length, 1)
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Avg Services/Category
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            📂
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start organizing your services by creating your first category.
          </p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors"
          >
            Create First Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/admin/${category.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/25 transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {category.icon && (
                  <div className="text-3xl">{category.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.serviceCount || 0} service
                      {(category.serviceCount || 0) !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(category.updatedAt))}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
