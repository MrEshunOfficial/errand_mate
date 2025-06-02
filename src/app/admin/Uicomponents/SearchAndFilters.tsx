// components/admin/categories/SearchAndFilters.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { CategoryQueryOptions } from "@/lib/services/categoryService";

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Partial<CategoryQueryOptions>) => void;
  filters: CategoryQueryOptions;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onFilterChange,
  filters,
  viewMode,
  onViewModeChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6"
    >
      <div className="space-y-4">
        {/* Top Row - Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Filter Toggle - Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle filters"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </motion.button>

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
                } transition-colors rounded-l-lg`}
                aria-label="Grid view"
              >
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
                } transition-colors rounded-r-lg`}
                aria-label="List view"
              >
                <ListBulletIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters || window.innerWidth >= 640 ? "auto" : 0,
            opacity: showFilters || window.innerWidth >= 640 ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-600">
            <div className="flex flex-col xs:flex-row gap-2 flex-1">
              {/* Sort By */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 sm:hidden">
                  Sort by
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    onFilterChange({
                      sortBy: e.target.value as CategoryQueryOptions["sortBy"],
                    })
                  }
                  className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Recent</option>
                  <option value="categoryName">Name</option>
                  <option value="updatedAt">Updated</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 sm:hidden">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    onFilterChange({
                      sortOrder: e.target
                        .value as CategoryQueryOptions["sortOrder"],
                    })
                  }
                  className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">↓ Descending</option>
                  <option value="asc">↑ Ascending</option>
                </select>
              </div>
            </div>

            {/* Items Per Page - Hidden on mobile */}
            <div className="hidden sm:block min-w-0">
              <select
                value={filters.limit || 12}
                onChange={(e) =>
                  onFilterChange({
                    limit: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={6}>6 per page</option>
                <option value={12}>12 per page</option>
                <option value={24}>24 per page</option>
                <option value={48}>48 per page</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchAndFilters;
