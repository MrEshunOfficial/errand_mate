// components/ui/category-card.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Package,
  Tag,
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Import the actual Category type from your store
import { Category } from "@/store/type/service-categories";

interface CategoryCardProps {
  category: Category;
  serviceCount: number;
  onClick: (categoryId: string) => void;
  className?: string;
}

// Enhanced Grid Card Component
export function CategoryGridCard({
  category,
  serviceCount,
  onClick,
  className,
}: CategoryCardProps) {
  const isPopular = serviceCount > 10;
  const isEmpty = serviceCount === 0;

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden border-0 bg-white dark:bg-slate-900",
        "shadow-lg hover:shadow-2xl transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:scale-[1.02]",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/0 before:via-purple-500/0 before:to-pink-500/0",
        "before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-500",
        "relative backdrop-blur-sm",
        className
      )}
      onClick={() => onClick(category._id.toString())}>
      {/* Status Badge */}
      {(isPopular || isEmpty) && (
        <div className="absolute top-3 right-3 z-10">
          {isPopular ? (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
              New
            </Badge>
          )}
        </div>
      )}

      {/* Image Section with Overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        {category.catImage?.url ? (
          <>
            <Image
              src={category.catImage.url}
              alt={category.catImage.catName || category.categoryName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-slate-700 dark:group-hover:to-slate-600 transition-all duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all duration-500" />
              <div className="relative p-6 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-500">
                <Package className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg border border-white/20">
            <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
              {category.categoryName}
            </CardTitle>
            <Sparkles className="h-5 w-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-all duration-500 ml-2 flex-shrink-0" />
          </div>

          {/* Service Count Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={serviceCount > 0 ? "default" : "secondary"}
              className={cn(
                "text-sm font-medium shadow-sm transition-all duration-300",
                serviceCount > 0
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
              )}>
              <Users className="h-3 w-3 mr-1" />
              {serviceCount} {serviceCount === 1 ? "service" : "services"}
            </Badge>
          </div>
        </div>

        {/* Description */}
        {category.description && (
          <CardDescription className="text-sm line-clamp-2 leading-relaxed text-gray-600 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors duration-300">
            {category.description}
          </CardDescription>
        )}

        {/* Tags */}
        {category.tags && category.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {category.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center text-xs px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-700 dark:text-blue-300 rounded-full font-medium border border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-300">
                {tag}
              </span>
            ))}
            {category.tags.length > 3 && (
              <span className="inline-flex items-center text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-full border border-gray-200 dark:border-slate-700 font-medium">
                +{category.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {new Date(category.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {isPopular && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <TrendingUp className="h-3 w-3" />
                <span>Trending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Enhanced List Card Component
export function CategoryListCard({
  category,
  serviceCount,
  onClick,
  className,
}: CategoryCardProps) {
  const isPopular = serviceCount > 10;
  const isEmpty = serviceCount === 0;

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden border-0 bg-white dark:bg-slate-900",
        "shadow-md hover:shadow-xl transition-all duration-500 ease-out",
        "hover:scale-[1.01] hover:-translate-y-1",
        "border-l-4 border-l-transparent hover:border-l-blue-500",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/0 before:to-purple-500/0",
        "before:opacity-0 hover:before:opacity-5 before:transition-opacity before:duration-500",
        "relative backdrop-blur-sm",
        className
      )}
      onClick={() => onClick(category._id.toString())}>
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Enhanced Image Section */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {/* Status Indicator */}
            {(isPopular || isEmpty) && (
              <div className="absolute -top-2 -right-2 z-10">
                {isPopular ? (
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            )}

            {category.catImage?.url ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
                <Image
                  src={category.catImage.url}
                  alt={category.catImage.catName || category.categoryName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500" />
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-slate-700 dark:group-hover:to-slate-600 transition-all duration-500 shadow-lg border border-white/20">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:bg-blue-500/40 transition-all duration-500" />
                  <Package className="relative h-10 w-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header with Action */}
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                  {category.categoryName}
                </h3>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={serviceCount > 0 ? "default" : "secondary"}
                    className={cn(
                      "text-sm font-medium shadow-sm transition-all duration-300",
                      serviceCount > 0
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                    )}>
                    <Users className="h-3 w-3 mr-1" />
                    {serviceCount} {serviceCount === 1 ? "service" : "services"}
                  </Badge>
                  {isPopular && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <p className="text-gray-600 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                {category.description}
              </p>
            )}

            {/* Tags and Meta */}
            <div className="flex items-center justify-between">
              {/* Tags */}
              {category.tags && category.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex gap-2 flex-wrap min-w-0">
                    {category.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-700 dark:text-blue-300 rounded-full font-medium border border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-300">
                        {tag}
                      </span>
                    ))}
                    {category.tags.length > 3 && (
                      <span className="inline-flex items-center text-xs px-2 py-1 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-full border border-gray-200 dark:border-slate-700 font-medium">
                        +{category.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 ml-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
