// app/admin/categories/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/store/type/service-categories";
import { CategoryQueryOptions } from "@/lib/services/categoryService";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategory";
import {
  FolderIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SearchAndFilters from "./Uicomponents/SearchAndFilters";
import DeleteCategoryModal from "./Uicomponents/DeleteCategoryModal";
import { CategoryCard } from "./Uicomponents/CategoryCard";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    filters,
    pagination,
    getCategories,
    searchCategoriesByQuery,
    updateFilters,
    clearCategoryError,
    refreshCategoriesData,
  } = useCategories();

  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    getCategories(filters);
  }, [getCategories, filters]);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await searchCategoriesByQuery(query);
    } else {
      await getCategories(filters);
    }
  };

  const handleFilterChange = (newFilters: Partial<CategoryQueryOptions>) => {
    updateFilters(newFilters);
  };

  const handleEdit = (category: Category) => {
    window.location.href = `/admin/categories/${category._id}/edit`;
  };

  const handleDelete = (id: string) => {
    setShowDeleteModal(id);
  };

  const handleDeleteSuccess = async () => {
    // Refresh the categories data after successful deletion
    await refreshCategoriesData(filters);
    setShowDeleteModal(null);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  // Error State
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
      >
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          <div className="flex-1">
            <h3 className="font-medium text-red-800 dark:text-red-200">
              Error occurred
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearCategoryError}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <XMarkIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your service categories
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/admin/categories/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Category
          </Link>
        </motion.div>
      </motion.div>

      <SearchAndFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse ${
                  viewMode === "grid" ? "h-80" : "h-20"
                }`}
              >
                <div
                  className={`bg-gray-300 dark:bg-gray-600 rounded-xl ${
                    viewMode === "grid" ? "h-48 mb-4" : "h-full"
                  }`}
                />
                {viewMode === "grid" && (
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : categories.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first category to get started
            </p>
            <Link
              href="/admin/categories/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Create Category
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category._id.toString()}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </motion.button>

          <div className="flex gap-1">
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
              const page = i + 1;
              return (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    pagination.page === page
                      ? "bg-blue-500 text-white"
                      : "border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        categoryId={showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
