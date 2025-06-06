// app/errand-services/categories/page.tsx
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useCategories } from "@/hooks/useCategory";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Package,
  Grid3X3,
  Filter,
  Eye,
  Loader2,
  AlertCircle,
  Plus,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "services-asc"
  | "services-desc"
  | "newest"
  | "oldest";
type ViewMode = "grid" | "list";

export default function CategoriesPage() {
  const router = useRouter();
  const {
    categories,
    loading,
    error,
    stats,
    getCategories,
    getCategoriesWithCounts,
    clearCategoryError,
  } = useCategories();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showOnlyWithServices, setShowOnlyWithServices] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          getCategories({ limit: 50 }),
          getCategoriesWithCounts(),
        ]);
      } catch (error) {
        console.error("Failed to initialize categories data:", error);
      }
    };

    initializeData();
  }, [getCategories, getCategoriesWithCounts]);

  // Get service count for a category
  const getServiceCount = useCallback(
    (categoryId: string): number => {
      const stat = stats?.find((s) => s._id === categoryId);
      return stat?.serviceCount || 0;
    },
    [stats]
  ); // <-- add 'stats' as a dependency

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = [...categories];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (category) =>
          category.categoryName.toLowerCase().includes(query) ||
          category.description?.toLowerCase().includes(query) ||
          category.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply service filter
    if (showOnlyWithServices) {
      filtered = filtered.filter(
        (category) => getServiceCount(category._id.toString()) > 0
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aServiceCount = getServiceCount(a._id.toString());
      const bServiceCount = getServiceCount(b._id.toString());

      switch (sortBy) {
        case "name-asc":
          return a.categoryName.localeCompare(b.categoryName);
        case "name-desc":
          return b.categoryName.localeCompare(a.categoryName);
        case "services-asc":
          return aServiceCount - bServiceCount;
        case "services-desc":
          return bServiceCount - aServiceCount;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [categories, searchQuery, showOnlyWithServices, getServiceCount, sortBy]);

  // Statistics
  const categoryStats = useMemo(() => {
    const totalCategories = categories.length;
    const categoriesWithServices = categories.filter(
      (cat) => getServiceCount(cat._id.toString()) > 0
    ).length;
    const emptyCategories = totalCategories - categoriesWithServices;
    const totalServices =
      stats?.reduce((sum, stat) => sum + stat.serviceCount, 0) || 0;

    return {
      totalCategories,
      categoriesWithServices,
      emptyCategories,
      totalServices,
    };
  }, [categories, getServiceCount, stats]);

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/errand-services/categories/${categoryId}`);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Loading categories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Grid3X3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Total Categories
                </p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {categoryStats.totalCategories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  With Services
                </p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {categoryStats.categoriesWithServices}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Empty
                </p>
                <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {categoryStats.emptyCategories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Total Services
                </p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {categoryStats.totalServices}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">
                    Error loading categories
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCategoryError}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="space-y-4">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={showOnlyWithServices ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyWithServices(!showOnlyWithServices)}
              className="h-8 text-xs gap-1"
            >
              <Filter className="h-3 w-3" />
              With Services Only
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="services-desc">Most Services</SelectItem>
                <SelectItem value="services-asc">Least Services</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0 rounded-none"
              >
                <Grid3X3 className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0 rounded-none"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid/List */}
      {filteredAndSortedCategories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Grid3X3 className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? "No categories found" : "No categories yet"}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 max-w-md mx-auto">
                  {searchQuery
                    ? `No categories match "${searchQuery}". Try adjusting your search terms.`
                    : "Get started by creating your first service category."}
                </p>
              </div>
              {!searchQuery && (
                <Button asChild className="gap-2">
                  <Link href="/admin/categories/new">
                    <Plus className="h-4 w-4" />
                    Create Category
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}
        >
          {filteredAndSortedCategories.map((category) => {
            const serviceCount = getServiceCount(category._id.toString());

            if (viewMode === "list") {
              return (
                <Card
                  key={category._id.toString()}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700"
                  onClick={() => handleCategoryClick(category._id.toString())}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        {category.catImage?.url ? (
                          <Image
                            src={category.catImage.url}
                            alt={
                              category.catImage.catName || category.categoryName
                            }
                            fill
                            className="object-cover rounded-lg"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-500 dark:text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {category.categoryName}
                          </h3>
                          <Badge
                            variant={serviceCount > 0 ? "default" : "secondary"}
                          >
                            {serviceCount}{" "}
                            {serviceCount === 1 ? "service" : "services"}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        {category.tags && category.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <div className="flex gap-1 flex-wrap">
                              {category.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {category.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{category.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card
                key={category._id.toString()}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 group"
                onClick={() => handleCategoryClick(category._id.toString())}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      {category.catImage?.url ? (
                        <Image
                          src={category.catImage.url}
                          alt={
                            category.catImage.catName || category.categoryName
                          }
                          fill
                          className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                          <Package className="h-5 w-5 text-gray-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.categoryName}
                      </CardTitle>
                      <Badge
                        variant={serviceCount > 0 ? "default" : "secondary"}
                        className="text-xs mt-1"
                      >
                        {serviceCount}{" "}
                        {serviceCount === 1 ? "service" : "services"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {category.description && (
                    <CardDescription className="text-sm line-clamp-3 mb-3">
                      {category.description}
                    </CardDescription>
                  )}

                  {category.tags && category.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {category.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {category.tags.length > 2 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{category.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      {filteredAndSortedCategories.length > 0 && (
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Showing {filteredAndSortedCategories.length} of {categories.length}{" "}
            categories
            {searchQuery && ` for "${searchQuery}"`}
            {showOnlyWithServices && " with services"}
          </p>
        </div>
      )}
    </div>
  );
}
