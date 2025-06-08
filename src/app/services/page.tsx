// pages/services/index.tsx or app/services/page.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Search,
  Package,
  Grid3X3,
  List,
  Star,
  Clock,
} from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategory";
import { Category } from "@/store/type/service-categories";
import { IServiceDocument } from "@/models/category-service-models/serviceModel";

const ServiceCard: React.FC<{
  service: IServiceDocument;
  index: number;
  viewMode: "grid" | "list";
  categories: Category[];
}> = ({ service, index, viewMode, categories }) => {
  const [imageError, setImageError] = useState(false);

  // Find category info
  const serviceCategory = categories.find(
    (cat) => cat._id.toString() === service.categoryId.toString()
  );

  const modernGradients = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-violet-500 to-violet-600",
    "from-rose-500 to-rose-600",
    "from-indigo-500 to-indigo-600",
  ];

  const fallbackGradient = modernGradients[index % modernGradients.length];

  // Handle category click - prevent event bubbling
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate programmatically if needed
    window.location.href = `/errand-services/categories/${serviceCategory?._id}`;
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Service Image/Icon */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
              {service.serviceImage?.url && !imageError ? (
                <Image
                  src={service.serviceImage.url}
                  alt={service.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
                >
                  <Package className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {service.title}
                </h3>
                {service.popular && (
                  <span className="flex-shrink-0 inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {serviceCategory && (
                  <button
                    onClick={handleCategoryClick}
                    className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    {serviceCategory.categoryName}
                  </button>
                )}
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Available
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <Link
                href={`/services/${service._id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Request Service
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group relative">
      <Link
        href={`/services/${service._id}`}
        className="block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl h-80 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
      >
        {/* Background */}
        <div className="absolute inset-0">
          {service.serviceImage?.url && !imageError ? (
            <Image
              src={service.serviceImage.url}
              alt={service.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
            >
              <Package className="h-12 w-12 text-white opacity-80" />
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 group-hover:to-black/30 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
          {/* Top - Category & Popular Badge */}
          <div className="flex items-start justify-between">
            {serviceCategory && (
              <button
                onClick={handleCategoryClick}
                className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-white/30 transition-colors cursor-pointer"
              >
                {serviceCategory.categoryName}
              </button>
            )}
            {service.popular && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-bold">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </span>
            )}
          </div>

          {/* Bottom - Service Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold mb-2 leading-tight">
                {service.title}
              </h3>
              <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 rounded-full px-4 py-2 text-sm font-semibold">
              Request Service
              <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Filter Component
const ServiceFilters: React.FC<{
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showPopularOnly: boolean;
  onPopularToggle: (show: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showPopularOnly,
  onPopularToggle,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option
                key={category._id.toString()}
                value={category._id.toString()}
              >
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Default Order</option>
            <option value="title">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="popular">Popular First</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Popular Filter */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showPopularOnly}
              onChange={(e) => onPopularToggle(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${
                showPopularOnly ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showPopularOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
              Popular Only
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || searchQuery || showPopularOnly || sortBy) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                Category:{" "}
                {
                  categories.find((c) => c._id.toString() === selectedCategory)
                    ?.categoryName
                }
                <button
                  onClick={() => onCategoryChange("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                Search: &quot;{searchQuery}&quot;
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {showPopularOnly && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                Popular Only
                <button
                  onClick={() => onPopularToggle(false)}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                Sort:{" "}
                {sortBy === "title"
                  ? "A-Z"
                  : sortBy === "title-desc"
                  ? "Z-A"
                  : sortBy}
                <button
                  onClick={() => onSortChange("")}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AllServicesPage() {
  const { services, loading, error, getServices } = useServices();
  const { categories, getCategories } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Initialize filters from URL parameters
  useEffect(() => {
    const popular = searchParams.get("popular");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    if (popular === "true") {
      setShowPopularOnly(true);
    }
    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
    if (sort) {
      setSortBy(sort);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (params: Record<string, string | boolean>) => {
    const newSearchParams = new URLSearchParams();

    // Add current filters to URL
    if (params.popular || showPopularOnly) {
      newSearchParams.set("popular", "true");
    }
    if (params.category || selectedCategory) {
      newSearchParams.set(
        "category",
        (params.category as string) || selectedCategory
      );
    }
    if (params.search || searchQuery) {
      newSearchParams.set("search", (params.search as string) || searchQuery);
    }
    if (params.sort || sortBy) {
      newSearchParams.set("sort", (params.sort as string) || sortBy);
    }

    const newURL = `/services${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
    }`;
    router.push(newURL, { scroll: false });
  };

  // Enhanced filter handlers that update URL
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateURL({ category: categoryId });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateURL({ search: query });
  };

  const handlePopularToggle = (show: boolean) => {
    setShowPopularOnly(show);
    updateURL({ popular: show });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL({ sort });
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getServices({ limit: 100 }),
          getCategories({ limit: 100 }),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getServices, getCategories]);

  // Filter and sort services based on current filters
  const filteredAndSortedServices = useMemo(() => {
    if (!services) return [];

    let filtered = services.filter((service) => {
      // Search filter
      if (
        searchQuery &&
        !service.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (
        selectedCategory &&
        service.categoryId.toString() !== selectedCategory
      ) {
        return false;
      }

      // Popular filter
      if (showPopularOnly && !service.popular) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "popular":
            return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
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
    }

    return filtered;
  }, [services, searchQuery, selectedCategory, showPopularOnly, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading services...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600 dark:text-red-400">
            Error loading services: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {showPopularOnly ? "Popular Services" : "All Services"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {showPopularOnly
              ? "Discover the most requested services by our community"
              : "Discover all available services in one place. Browse by category or search for specific services."}
          </p>
        </div>

        {/* Filters */}
        <ServiceFilters
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          showPopularOnly={showPopularOnly}
          onPopularToggle={handlePopularToggle}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* View Mode Toggle & Results Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedServices.length} of{" "}
              {services?.length || 0} service
              {filteredAndSortedServices.length !== 1 ? "s" : ""}
            </p>
            {categories && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                from {categories.length} categor
                {categories.length !== 1 ? "ies" : "y"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services Grid/List */}
        {filteredAndSortedServices.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {services?.length === 0
                ? "No services available"
                : showPopularOnly
                ? "No popular services found"
                : "No services found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {services?.length === 0
                ? "Services will appear here once they are added."
                : showPopularOnly
                ? "Try removing the popular filter or check back later."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "space-y-4"
            }
          >
            {filteredAndSortedServices.map((service, index) => (
              <ServiceCard
                key={service._id.toString()}
                service={service}
                index={index}
                viewMode={viewMode}
                categories={categories || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
