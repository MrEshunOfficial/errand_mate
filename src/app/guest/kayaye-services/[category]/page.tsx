"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CategoryDetailPage() {
  const router = useRouter();
  const pathname = usePathname();

  const { categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  // Extract categoryId from pathname
  const pathParts = pathname.split("/");
  const categorySlug = pathParts[pathParts.length - 1];

  const currentCategory = categories.find(
    (category) =>
      category.id === categorySlug ||
      encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, "-")) ===
        categorySlug
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading categories...
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-600 dark:text-gray-300 mb-4">
          Category not found
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/guest/kayaye-services")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Category Header */}
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => router.push("/guest/kayaye-services")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
            {currentCategory.icon &&
            typeof currentCategory.icon === "string" ? (
              <Image
                src={currentCategory.icon}
                alt={currentCategory.name}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                {currentCategory.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentCategory.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {currentCategory.description ||
                `Explore our ${currentCategory.name.toLowerCase()} services tailored to meet your specific needs.`}
            </p>
          </div>
        </div>
      </header>

      {/* Subcategories Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Available Services
        </h2>

        {currentCategory.subcategories &&
        currentCategory.subcategories.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {currentCategory.subcategories.map((subcategory) => (
              <motion.div
                key={subcategory.id}
                variants={itemVariants}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                      {subcategory.icon &&
                      typeof subcategory.icon === "string" ? (
                        <Image
                          src={subcategory.icon}
                          alt={subcategory.name}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {subcategory.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {subcategory.description ||
                      `${
                        subcategory.name
                      } service within our ${currentCategory.name.toLowerCase()} offerings.`}
                  </p>

                  <Link
                    href={`/guest/kayaye-services/${categorySlug}/${subcategory.id}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              No services available in this category.
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Please check back later for updates.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
