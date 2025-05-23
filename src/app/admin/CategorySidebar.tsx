// components/CategorySidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/store/type/service-categories";

export const CategorySidebar: React.FC = () => {
  const pathname = usePathname();
  const { categories, loading, error, loadCategories, clearError } =
    useCategories();

  // Load categories on component mount
  React.useEffect(() => {
    loadCategories(false, true);
  }, [loadCategories]);

  const handleRetry = () => {
    clearError();
    loadCategories(false, true);
  };

  if (loading && categories.length === 0) {
    return (
      <aside className="w-64 bg-gray-100 p-4 text-black border-r">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        </div>
        <div className="space-y-3">
          {/* Loading skeleton */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 bg-gray-100 p-4 text-black border-r">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        </div>
        <div className="text-center">
          <div className="text-red-600 text-sm mb-3">
            Error loading categories: {error}
          </div>
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-100 p-4 text-black border-r">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        <p className="text-sm text-gray-600 mt-1">
          {categories.length} categories available
        </p>
      </div>

      <nav className="space-y-2">
        {/* All Categories Link */}
        <Link
          href="/dashboard/categories"
          className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === "/dashboard/categories"
              ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>All Categories</span>
            <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
              {categories.length}
            </span>
          </div>
        </Link>

        {/* Individual Category Links */}
        {categories.map((category: Category) => {
          const isActive = pathname === `/dashboard/categories/${category.id}`;

          return (
            <Link
              key={category.id}
              href={`/dashboard/categories/${category.id}`}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                {category.icon && (
                  <span className="text-lg">{category.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {category.description}
                    </div>
                  )}
                </div>
                {category.serviceCount !== undefined && (
                  <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
                    {category.serviceCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <Link
          href="/dashboard/categories/new"
          className="block w-full px-3 py-2 bg-blue-500 text-white text-sm text-center rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New Category
        </Link>
      </div>
    </aside>
  );
};
