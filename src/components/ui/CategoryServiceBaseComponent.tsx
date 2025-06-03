// components/categories/BaseCategoriesPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/store/type/service-categories";
import { CategoryQueryOptions } from "@/lib/services/categoryService";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategory";
import {
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChartBarIcon,
  EyeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

// Types for different modes
export type CategoryPageMode = "admin" | "public";

export interface CategoryActionConfig {
  mode: CategoryPageMode;
  showCreate?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showServices?: boolean;
  onRequestService?: (categoryId: string) => void;
  customActions?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: (category: Category) => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
}

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
  onView?: (category: Category) => void;
  onRequestService?: (categoryId: string) => void;
  index: number;
  viewMode: "grid" | "list";
  actionConfig: CategoryActionConfig;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onView,
  onRequestService,
  index,
  viewMode,
  actionConfig,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const renderActions = () => {
    const actions = [];

    // Admin actions
    if (actionConfig.mode === "admin") {
      if (actionConfig.showView !== false) {
        actions.push(
          <Link
            key="view"
            href={`/admin/categories/${category._id}`}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors text-center">
            View
          </Link>
        );
      }

      if (actionConfig.showEdit !== false && onEdit) {
        actions.push(
          <motion.button
            key="edit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(category)}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
        );
      }

      if (actionConfig.showDelete !== false && onDelete) {
        actions.push(
          <motion.button
            key="delete"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(category._id.toString())}
            className="p-2 border border-red-200 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <TrashIcon className="w-4 h-4 text-red-500" />
          </motion.button>
        );
      }
    }

    // Public actions
    if (actionConfig.mode === "public") {
      if (actionConfig.showView !== false && onView) {
        actions.push(
          <motion.button
            key="view"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(category)}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors text-center flex items-center justify-center gap-2">
            <EyeIcon className="w-4 h-4" />
            View Services
          </motion.button>
        );
      }

      if (actionConfig.showServices !== false && onRequestService) {
        actions.push(
          <motion.button
            key="request"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRequestService(category._id.toString())}
            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors text-center flex items-center justify-center gap-2">
            <ShoppingBagIcon className="w-4 h-4" />
            Request Service
          </motion.button>
        );
      }
    }

    // Custom actions
    if (actionConfig.customActions) {
      actionConfig.customActions.forEach((action, idx) => {
        const baseClasses = "p-2 rounded-lg transition-colors";
        const variantClasses = {
          primary: "bg-blue-500 hover:bg-blue-600 text-white",
          secondary:
            "border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
          danger:
            "border border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
        };

        actions.push(
          <motion.button
            key={`custom-${idx}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => action.onClick(category)}
            className={`${baseClasses} ${
              variantClasses[action.variant || "secondary"]
            }`}
            title={action.label}>
            <action.icon className="w-4 h-4" />
          </motion.button>
        );
      });
    }

    return actions;
  };

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {category.catImage ? (
              <Image
                src={category.catImage.url}
                alt={category.catImage.catName}
                className="w-full h-full object-cover"
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
                priority={index < 6}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FolderIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {category.categoryName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {category.description || "No description"}
            </p>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <ChartBarIcon className="w-3 h-3" />
                {category.serviceCount || category.serviceIds?.length || 0}{" "}
                services
              </span>
              {actionConfig.mode === "admin" && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">{renderActions()}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <motion.div variants={hoverVariants}>
        {/* Image */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
          {category.catImage ? (
            <Image
              src={category.catImage.url}
              alt={category.catImage.catName}
              className="w-full h-full object-cover"
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={index < 6}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Service count badge */}
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {category.serviceCount || category.serviceIds?.length || 0}
          </div>

          {/* Mode indicator for admin */}
          {actionConfig.mode === "admin" && (
            <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Admin
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {category.categoryName}
          </h3>

          {category.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* Tags */}
          {category.tags && category.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {category.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md">
                  <TagIcon className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {category.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-md">
                  +{category.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Date - only show for admin */}
          {actionConfig.mode === "admin" && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
              <CalendarIcon className="w-3 h-3" />
              {new Date(category.createdAt).toLocaleDateString()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">{renderActions()}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SearchAndFilters: React.FC<{
  onSearch: (query: string) => void;
  onFilterChange: (filters: Partial<CategoryQueryOptions>) => void;
  filters: CategoryQueryOptions;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  actionConfig: CategoryActionConfig;
}> = ({
  onSearch,
  onFilterChange,
  filters,
  viewMode,
  onViewModeChange,
  actionConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${
                actionConfig.mode === "admin" ? "categories" : "services"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as CategoryQueryOptions["sortBy"],
              })
            }
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="createdAt">Recent</option>
            <option value="categoryName">Name</option>
            {actionConfig.mode === "admin" && (
              <option value="updatedAt">Updated</option>
            )}
            {actionConfig.mode === "public" && (
              <option value="serviceCount">Popular</option>
            )}
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) =>
              onFilterChange({
                sortOrder: e.target.value as CategoryQueryOptions["sortOrder"],
              })
            }
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="desc">↓ Desc</option>
            <option value="asc">↑ Asc</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              } transition-colors rounded-l-lg`}>
              <Squares2X2Icon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              } transition-colors rounded-r-lg`}>
              <ListBulletIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface BaseCategoriesPageProps {
  actionConfig: CategoryActionConfig;
  title?: string;
  subtitle?: string;
  createButtonText?: string;
  createButtonLink?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateActionText?: string;
  emptyStateActionLink?: string;
  onCategoryView?: (category: Category) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (id: string) => void;
  onRequestService?: (categoryId: string) => void;
}

export default function BaseCategoriesPage({
  actionConfig,
  title,
  subtitle,
  createButtonText,
  createButtonLink,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionText,
  emptyStateActionLink,
  onCategoryView,
  onCategoryEdit,
  onCategoryDelete,
  onRequestService,
}: BaseCategoriesPageProps) {
  const {
    categories,
    loading,
    error,
    filters,
    pagination,
    getCategories,
    searchCategoriesByQuery,
    removeCategory,
    updateFilters,
    clearCategoryError,
  } = useCategories();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Default values based on mode
  const defaults = {
    admin: {
      title: "Categories",
      subtitle: "Manage your service categories",
      createButtonText: "Add Category",
      createButtonLink: "/admin/categories/create",
      emptyStateTitle: "No categories found",
      emptyStateDescription: "Create your first category to get started",
      emptyStateActionText: "Create Category",
      emptyStateActionLink: "/admin/categories/create",
    },
    public: {
      title: "Service Categories",
      subtitle: "Explore our available services",
      createButtonText: "Request Custom Service",
      createButtonLink: "/services/request",
      emptyStateTitle: "No services available",
      emptyStateDescription: "We're working on adding more services",
      emptyStateActionText: "Request Service",
      emptyStateActionLink: "/services/request",
    },
  };

  const config = defaults[actionConfig.mode];

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
    if (onCategoryEdit) {
      onCategoryEdit(category);
    } else if (actionConfig.mode === "admin") {
      window.location.href = `/admin/categories/${category._id}/edit`;
    }
  };

  const handleView = (category: Category) => {
    if (onCategoryView) {
      onCategoryView(category);
    } else if (actionConfig.mode === "public") {
      window.location.href = `/categories/${category._id}/services`;
    }
  };

  const handleDelete = async (id: string) => {
    if (showDeleteConfirm === id) {
      try {
        if (onCategoryDelete) {
          onCategoryDelete(id);
        } else {
          await removeCategory(id);
        }
        setShowDeleteConfirm(null);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    } else {
      setShowDeleteConfirm(id);
    }
  };

  const handleRequestService = (categoryId: string) => {
    if (onRequestService) {
      onRequestService(categoryId);
    } else {
      window.location.href = `/services/request?category=${categoryId}`;
    }
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
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
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
            className="text-red-500 hover:text-red-700 p-1">
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
        className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title || config.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {subtitle || config.subtitle}
          </p>
        </div>
        {actionConfig.showCreate !== false && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={createButtonLink || config.createButtonLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              <PlusIcon className="w-4 h-4" />
              {createButtonText || config.createButtonText}
            </Link>
          </motion.div>
        )}
      </motion.div>

      <SearchAndFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actionConfig={actionConfig}
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
            }>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse ${
                  viewMode === "grid" ? "h-80" : "h-20"
                }`}>
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
            className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {emptyStateTitle || config.emptyStateTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {emptyStateDescription || config.emptyStateDescription}
            </p>
            <Link
              href={emptyStateActionLink || config.emptyStateActionLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              <PlusIcon className="w-4 h-4" />
              {emptyStateActionText || config.emptyStateActionText}
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
            }>
            {categories.map((category, index) => (
              <CategoryCard
                key={category._id.toString()}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onRequestService={handleRequestService}
                index={index}
                viewMode={viewMode}
                actionConfig={actionConfig}
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
          className="flex justify-center items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
                  }`}>
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
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChevronRightIcon className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Delete Category
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this category? This will also
                affect any services associated with it.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Footer - Admin only */}
      {actionConfig.mode === "admin" && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {categories.length} of {pagination.total} categories
            </span>
            <span className="flex items-center gap-1">
              <ChartBarIcon className="w-4 h-4" />
              {categories.reduce(
                (sum, cat) =>
                  sum + (cat.serviceCount || cat.serviceIds?.length || 0),
                0
              )}{" "}
              total services
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
