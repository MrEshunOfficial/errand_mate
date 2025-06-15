// src/components/service-provider/ServiceSelector.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Types } from "mongoose";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Check,
  Filter,
  CheckSquare,
  Square,
  Minus,
  Image as ImageIcon,
  Plus,
  X,
  ChevronDown,
  Package,
} from "lucide-react";
import { IServiceDocument } from "@/models/category-service-models/serviceModel";
import { Category } from "@/store/type/service-categories";

interface ServiceSelectorProps {
  services: IServiceDocument[];
  categories: Category[];
  selectedServices: Types.ObjectId[];
  onServiceToggle: (serviceId: Types.ObjectId) => void;
  onClearAll: () => void;
  disabled?: boolean;
  className?: string;
  showError?: boolean; // Add this prop to control when to show errors
}

interface ServiceItemProps {
  service: IServiceDocument;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  compact?: boolean;
}

interface CategorySectionProps {
  category: Category;
  services: IServiceDocument[];
  selectedServices: Types.ObjectId[];
  onServiceToggle: (serviceId: Types.ObjectId) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  disabled?: boolean;
}

// Utility functions for safe ID comparison
const safeCompareIds = (
  id1: Types.ObjectId | string,
  id2: Types.ObjectId | string
): boolean => {
  const str1 = id1.toString();
  const str2 = id2.toString();
  return str1 === str2;
};

const safeObjectIdEquals = (
  id1: Types.ObjectId | string,
  id2: Types.ObjectId | string
): boolean => {
  if (id1 instanceof Types.ObjectId && id2 instanceof Types.ObjectId) {
    return id1.equals(id2);
  }
  return safeCompareIds(id1, id2);
};

// Utility function to get image URL from service
const getServiceImageUrl = (service: IServiceDocument): string | null => {
  if (service.serviceImage) {
    if (
      typeof service.serviceImage === "object" &&
      "url" in service.serviceImage
    ) {
      return service.serviceImage.url;
    }
    if (typeof service.serviceImage === "string") {
      return service.serviceImage;
    }
  }
  return null;
};

// Compact Service Item Component for Popover
const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  isSelected,
  onToggle,
  disabled = false,
  compact = false,
}) => {
  const imageUrl = getServiceImageUrl(service);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`
        relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/50"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}
        ${compact ? "p-2" : "p-3"}
      `}
      onClick={disabled ? undefined : onToggle}
    >
      {/* Selection Indicator */}
      <div
        className={`
          flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200
          ${
            isSelected
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300 dark:border-gray-600"
          }
        `}
      >
        {isSelected && (
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        )}
      </div>

      {/* Service Image */}
      <div className="flex-shrink-0">
        {imageUrl ? (
          <div
            className={`relative ${
              compact ? "w-8 h-8" : "w-10 h-10"
            } rounded-md overflow-hidden`}
          >
            <Image
              src={imageUrl}
              alt={service.title}
              fill
              className="object-cover"
              sizes={compact ? "32px" : "40px"}
              onError={(e) => {
                // Hide the image and show fallback
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback =
                  target.parentElement?.querySelector(".fallback-icon");
                if (fallback) {
                  (fallback as HTMLElement).style.display = "flex";
                }
              }}
            />
            {/* Fallback placeholder */}
            <div
              className="fallback-icon absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              style={{ display: "none" }}
            >
              <ImageIcon
                className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-gray-400`}
              />
            </div>
          </div>
        ) : (
          <div
            className={`${
              compact ? "w-8 h-8" : "w-10 h-10"
            } rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}
          >
            <ImageIcon
              className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-gray-400`}
            />
          </div>
        )}
      </div>

      {/* Service Info */}
      <div className="flex-1 min-w-0">
        <h4
          className={`font-medium text-gray-900 dark:text-gray-100 truncate ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {service.title}
        </h4>
      </div>
    </motion.div>
  );
};

// Category Section Component for Popover
const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  services,
  selectedServices,
  onServiceToggle,
  onSelectAll,
  onDeselectAll,
  disabled = false,
}) => {
  const categoryServices = services.filter(
    (service) =>
      safeCompareIds(service.categoryId, category._id) && service.isActive
  );

  const selectedCount = categoryServices.filter((service) =>
    selectedServices.some((id) => safeObjectIdEquals(id, service._id))
  ).length;

  const totalCount = categoryServices.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

  const handleToggleAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  if (totalCount === 0) return null;

  return (
    <div className="space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggleAll}
          disabled={disabled}
          className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-500" />
            ) : isPartiallySelected ? (
              <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                <Minus className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            ) : (
              <Square className="w-4 h-4 text-gray-400" />
            )}
          </div>
          {category.categoryName}
        </button>
        <Badge variant="outline" className="text-xs">
          {selectedCount}/{totalCount}
        </Badge>
      </div>

      {/* Services List */}
      <div className="space-y-2">
        {categoryServices.map((service) => (
          <ServiceItem
            key={service._id.toString()}
            service={service}
            isSelected={selectedServices.some((id) =>
              safeObjectIdEquals(id, service._id)
            )}
            onToggle={() => onServiceToggle(service._id)}
            disabled={disabled}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
};

// Selected Service Display Component
const SelectedServiceTag: React.FC<{
  service: IServiceDocument;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ service, onRemove, disabled }) => {
  const imageUrl = getServiceImageUrl(service);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-700 rounded-lg"
    >
      {/* Service Image */}
      <div className="flex-shrink-0">
        {imageUrl ? (
          <div className="relative w-6 h-6 rounded overflow-hidden">
            <Image
              src={imageUrl}
              alt={service.title}
              fill
              className="object-cover"
              sizes="24px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback =
                  target.parentElement?.querySelector(".fallback-icon");
                if (fallback) {
                  (fallback as HTMLElement).style.display = "flex";
                }
              }}
            />
            <div
              className="fallback-icon absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              style={{ display: "none" }}
            >
              <ImageIcon className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ImageIcon className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>

      {/* Service Name */}
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate max-w-32">
        {service.title}
      </span>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        disabled={disabled}
        className="flex-shrink-0 p-0.5 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

// Main ServiceSelector Component
const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  categories,
  selectedServices,
  onServiceToggle,
  onClearAll,
  disabled = false,
  className = "",
  showError = false, // Only show error when explicitly requested
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Get selected service objects
  const selectedServiceObjects = useMemo(() => {
    return services.filter((service) =>
      selectedServices.some((id) => safeObjectIdEquals(id, service._id))
    );
  }, [services, selectedServices]);

  // Filter services for popover
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (!service.isActive) return false;

      const matchesSearch = service.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        safeCompareIds(service.categoryId, selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  // Get categories that have services
  const categoriesWithServices = useMemo(() => {
    return categories.filter((category) =>
      filteredServices.some((service) =>
        safeCompareIds(service.categoryId, category._id)
      )
    );
  }, [categories, filteredServices]);

  // Handle select all services in a category
  const handleSelectAllInCategory = (categoryId: string) => {
    const categoryServices = services.filter(
      (service) =>
        safeCompareIds(service.categoryId, categoryId) && service.isActive
    );

    categoryServices.forEach((service) => {
      if (!selectedServices.some((id) => safeObjectIdEquals(id, service._id))) {
        onServiceToggle(service._id);
      }
    });
  };

  // Handle deselect all services in a category
  const handleDeselectAllInCategory = (categoryId: string) => {
    const categoryServices = services.filter(
      (service) =>
        safeCompareIds(service.categoryId, categoryId) && service.isActive
    );

    categoryServices.forEach((service) => {
      if (selectedServices.some((id) => safeObjectIdEquals(id, service._id))) {
        onServiceToggle(service._id);
      }
    });
  };

  // Get service categories for filtering
  const serviceCategories = useMemo(() => {
    const categoryMap = new Map<string, { name: string; count: number }>();

    categories.forEach((category) => {
      const count = services.filter(
        (service) =>
          service.isActive && safeCompareIds(service.categoryId, category._id)
      ).length;

      if (count > 0) {
        categoryMap.set(category._id.toString(), {
          name: category.categoryName,
          count,
        });
      }
    });

    return Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }, [services, categories]);

  const totalSelected = selectedServices.length;
  const totalAvailable = services.filter((s) => s.isActive).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selection Error - Only show when showError is true and no services selected */}
      {showError && totalSelected === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <Package className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">
              No Services Selected
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Please select at least one service to continue.
            </p>
          </div>
        </motion.div>
      )}

      {/* Selected Services Display */}
      {totalSelected > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Selected Services ({totalSelected})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              disabled={disabled}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 h-8 text-xs"
            >
              Clear All
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedServiceObjects.map((service) => (
                <SelectedServiceTag
                  key={service._id.toString()}
                  service={service}
                  onRemove={() => onServiceToggle(service._id)}
                  disabled={disabled}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Service Selection Popover */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>
                {totalSelected > 0
                  ? `Add More Services (${totalSelected} selected)`
                  : "Select Services"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0" align="start" sideOffset={4}>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Search and Filter */}
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-9">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Categories ({totalAvailable})
                  </SelectItem>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Services by Category */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {filteredServices.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <Search className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {searchTerm || selectedCategory !== "all"
                        ? "No services match your criteria"
                        : "No services available"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {categoriesWithServices.map((category) => (
                      <CategorySection
                        key={category._id.toString()}
                        category={category}
                        services={filteredServices}
                        selectedServices={selectedServices}
                        onServiceToggle={onServiceToggle}
                        onSelectAll={() =>
                          handleSelectAllInCategory(category._id.toString())
                        }
                        onDeselectAll={() =>
                          handleDeselectAllInCategory(category._id.toString())
                        }
                        disabled={disabled}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ServiceSelector;
