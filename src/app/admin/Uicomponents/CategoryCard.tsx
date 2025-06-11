// components/CategoryCard.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Folder,
  Calendar,
  Tag,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";
import { Category } from "@/store/type/service-categories";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  index: number;
  viewMode: "grid" | "list";
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  index,
  viewMode,
}) => {
  const [imageError, setImageError] = useState(false);

  const modernGradients = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-violet-500 to-violet-600",
    "from-rose-500 to-rose-600",
    "from-indigo-500 to-indigo-600",
  ];

  const fallbackGradient = modernGradients[index % modernGradients.length];

  // Handle action clicks - prevent event bubbling
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(category);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(category._id.toString());
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Category Image/Icon */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
              {category.catImage?.url && !imageError ? (
                <Image
                  src={category.catImage.url}
                  alt={category.catImage.catName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
                >
                  <Folder className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {category.categoryName}
                </h3>
                {(category.serviceCount || category.serviceIds?.length || 0) >
                  0 && (
                  <span className="flex-shrink-0 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {category.serviceCount ||
                      category.serviceIds?.length ||
                      0}{" "}
                    Services
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {category.description || "No description available"}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
                {category.tags && category.tags.length > 0 && (
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {category.tags.length} Tags
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 text-sm font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
              <Link
                href={`/admin/categories/${category._id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View Details
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
        href={`/admin/categories/${category._id}`}
        className="block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl h-80 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
      >
        {/* Background */}
        <div className="absolute inset-0">
          {category.catImage?.url && !imageError ? (
            <Image
              src={category.catImage.url}
              alt={category.catImage.catName}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
            >
              <Folder className="h-12 w-12 text-white opacity-80" />
            </div>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 group-hover:to-black/30 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
          {/* Top - Service Count & Tags */}
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              <BarChart3 className="w-3 h-3 mr-1" />
              {category.serviceCount || category.serviceIds?.length || 0}{" "}
              Services
            </span>
            {category.tags && category.tags.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-xs font-bold">
                <Tag className="w-3 h-3 mr-1" />
                {category.tags.length} Tags
              </span>
            )}
          </div>

          {/* Bottom - Category Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold mb-2 leading-tight">
                {category.categoryName}
              </h3>
              <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
                {category.description || "No description available"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/80 mb-3">
              <Calendar className="w-3 h-3" />
              {new Date(category.createdAt).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 rounded-full px-3 py-2 text-xs font-semibold"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center bg-red-500/80 backdrop-blur-sm hover:bg-red-500/90 transition-colors duration-300 rounded-full px-3 py-2 text-xs font-semibold"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 rounded-full px-4 py-2 text-sm font-semibold">
                View Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
