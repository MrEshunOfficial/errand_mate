"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, X, Check, Filter, Grid } from "lucide-react";

interface CategoryScrollerProps {
  categories: Array<{ id: string; label: string }>;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  maxVisibleCategories?: number;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  maxVisibleCategories = 5, // Default to showing 5 categories before "More" button
}) => {
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [filterText, setFilterText] = useState("");

  const expandedMenuRef = useRef<HTMLDivElement>(null);

  // Separate visible categories and hidden categories
  const visibleCategories = useMemo(() => {
    return categories.slice(
      0,
      Math.min(maxVisibleCategories, categories.length)
    );
  }, [categories, maxVisibleCategories]);

  const hiddenCategoriesCount = Math.max(
    0,
    categories.length - maxVisibleCategories
  );

  // Filter categories when expanded view is open
  const filteredCategories = useMemo(() => {
    if (!filterText) return categories;
    return categories.filter((cat) =>
      cat.label.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [categories, filterText]);

  // Close expanded categories menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        expandedMenuRef.current &&
        !expandedMenuRef.current.contains(event.target as Node)
      ) {
        setExpandedCategories(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setExpandedCategories(false);
    }
  };

  return (
    <div
      className="mb-6 relative"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Service Categories"
    >
      {/* Fixed category container */}
      <div className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-2 shadow-sm">
        {/* Non-scrollable tabs container */}
        <div className="flex items-center">
          <TabsList
            className="flex flex-wrap bg-transparent gap-2 pb-1 flex-1"
            aria-orientation="horizontal"
            aria-label="Category navigation"
          >
            {visibleCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`
                  px-5 py-2.5 rounded-lg transition-all duration-200 
                  font-medium text-sm
                  ${
                    activeCategory === category.id
                      ? "bg-blue-600 shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }
                `}
                onClick={() => setActiveCategory(category.id)}
                aria-selected={activeCategory === category.id}
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* "More" button - always at the end */}
          {hiddenCategoriesCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className={`
                rounded-lg h-9 px-4 ml-2 flex items-center gap-1.5
                ${
                  expandedCategories
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                }
                shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
              `}
              onClick={() => setExpandedCategories(!expandedCategories)}
              aria-expanded={expandedCategories}
              aria-controls="expanded-categories-menu"
              aria-label={
                expandedCategories
                  ? "Close categories"
                  : `Show all categories (+${hiddenCategoriesCount} more)`
              }
            >
              {expandedCategories ? (
                <>
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Close</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">see all</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5 ml-1">
                    {hiddenCategoriesCount}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-0.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced expanded categories panel */}
      <AnimatePresence>
        {expandedCategories && (
          <motion.div
            id="expanded-categories-menu"
            ref={expandedMenuRef}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 backdrop-blur-lg bg-white/95 dark:bg-gray-800/95"
            role="dialog"
            aria-modal="true"
            aria-label="All categories"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  All Categories ({categories.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setExpandedCategories(false)}
                aria-label="Close categories"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search filter - only show for larger category lists */}
            {categories.length > 8 && (
              <div className="mb-4 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Filter className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter categories..."
                  className="w-full p-2 pl-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter categories"
                />
                {filterText && (
                  <button
                    onClick={() => setFilterText("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Clear filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Categories grid with enhanced styling */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredCategories.length === 0 ? (
                <div className="col-span-full text-center py-6 text-gray-500">
                  No categories match your filter
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <button
                    key={`expanded-${category.id}`}
                    className={`
                      p-3 text-left rounded-lg transition-all duration-200 
                      flex items-center gap-2
                      ${
                        activeCategory === category.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium ring-1 ring-blue-200 dark:ring-blue-800"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setExpandedCategories(false);
                    }}
                    aria-selected={activeCategory === category.id}
                    role="option"
                  >
                    <div
                      className={`
                      w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center
                      ${
                        activeCategory === category.id
                          ? "bg-blue-100 dark:bg-blue-800/60"
                          : ""
                      }
                    `}
                    >
                      {activeCategory === category.id && (
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <span className="truncate">{category.label}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
