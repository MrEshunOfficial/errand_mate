"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CategoriesPage() {
  const { categories } = useSelector((state: RootState) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Generate URL-friendly slug from category name
  const getCategorySlug = (name: string) => {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text dark:from-blue-400 dark:to-cyan-300 mb-4">
          Explore Our Services
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Browse through our wide range of services tailored to meet your
          errands and delivery needs
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Categories Sidebar */}
        <aside className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Categories
            </h2>
            <motion.nav
              className="space-y-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible">
              <motion.div variants={itemVariants}>
                <Link
                  href="/guest/kayaye-services"
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(null)}>
                  All Services
                </Link>
              </motion.div>

              {categories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link
                    href={`/guest/kayaye-services/${getCategorySlug(
                      category.name
                    )}`}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}>
                    {category.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-9">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-40 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                  {category.icon && typeof category.icon === "string" ? (
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {category.description ||
                      `Explore our ${category.name.toLowerCase()} services tailored to meet your specific needs.`}
                  </p>
                  <Link
                    href={`/guest/kayaye-services/${getCategorySlug(
                      category.name
                    )}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                    View Services <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {categories.length === 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
                No categories available at the moment.
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Please check back later for our services.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
