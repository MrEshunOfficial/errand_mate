// components/CategoryCard.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Category } from "@/store/type/service-categories";
import Link from "next/link";
import Image from "next/image";
import {
  FolderIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  index: number;
  viewMode: "grid" | "list";
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  index,
  viewMode,
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

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow duration-200"
      >
        <div className="flex items-center gap-4">
          {/* Image - Fixed container with proper constraints */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative">
            {category.catImage ? (
              <Image
                src={category.catImage.url}
                alt={category.catImage.catName}
                fill
                sizes="64px"
                className="object-cover"
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
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(category)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(category._id.toString())}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </motion.button>
          </div>
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
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <motion.div variants={hoverVariants}>
        {/* Image */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
          {category.catImage ? (
            <Image
              src={category.catImage.url}
              alt={category.catImage.catName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
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
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md"
                >
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
          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <CalendarIcon className="w-3 h-3" />
            {new Date(category.createdAt).toLocaleDateString()}
          </div>
          {/* Alternative version with more prominent actions */}
          <div className="flex flex-col gap-2">
            <Link
              href={`/admin/categories/${category._id}`}
              className="w-full group/btn relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </span>
            </Link>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(category)}
                className="flex-1 group/edit relative inline-flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/edit:text-blue-600 dark:group-hover/edit:text-blue-400">
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(category._id.toString())}
                className="flex-1 group/delete relative inline-flex items-center justify-center px-3 py-2 border border-red-200 dark:border-red-600 rounded-lg hover:border-red-400 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 group-hover/delete:text-red-700 dark:group-hover/delete:text-red-300">
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;
