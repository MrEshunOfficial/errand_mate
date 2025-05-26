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

  // Load categories on component mount - remove loadCategories from dependencies
  React.useEffect(() => {
    loadCategories(false, true);
  }, []); // Empty dependency array to run only once

  const handleRetry = () => {
    clearError();
    loadCategories(false, true);
  };

  if (loading && categories.length === 0) {
    return (
      <aside className="w-72 bg-gray-100 dark:bg-gray-800 p-4 text-black dark:text-white border-r border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Categories
          </h2>
        </div>
        <div className="space-y-3">
          {/* Loading skeleton */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-72 bg-gray-100 dark:bg-gray-800 p-4 text-black dark:text-white border-r border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Categories
          </h2>
        </div>
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-sm mb-3">
            Error loading categories: {error}
          </div>
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-gray-100 dark:bg-gray-800 p-4 text-black dark:text-white border-r border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Categories
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {categories.length} categories available
        </p>
      </div>

      <nav className="space-y-2">
        {/* All Categories Link */}
        <Link
          key="all-categories"
          href="/admin"
          className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === "/admin"
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-l-4 border-blue-500 dark:border-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>All Categories</span>
            <span className="text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {categories.length}
            </span>
          </div>
        </Link>

        {/* Individual Category Links */}
        {categories.map((category: Category) => {
          const isActive = pathname === `/admin/${category.id}`;

          return (
            <Link
              key={category.id}
              href={`/admin/${category.id}`}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-l-4 border-blue-500 dark:border-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                {category.icon && (
                  <span className="text-lg">{category.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {category.description}
                    </div>
                  )}
                </div>
                {category.serviceCount !== undefined && (
                  <span className="text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                    {category.serviceCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
        <Link
          href="/admin/categories/new"
          className="block w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm text-center rounded-md transition-colors"
        >
          Add New Category
        </Link>
      </div>
    </aside>
  );
};
