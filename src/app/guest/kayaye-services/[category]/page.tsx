"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { fetchCategoryById } from "@/store/category-redux-slice";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, currentCategory, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const categoryId = resolvedParams.category;

  useEffect(() => {
    // Only fetch if we don't already have the category data
    const existingCategory = categories.find((cat) => cat.id === categoryId);
    if (
      categoryId &&
      !existingCategory &&
      !(currentCategory?.id === categoryId)
    ) {
      dispatch(fetchCategoryById(categoryId));
    }
  }, [dispatch, categoryId, categories, currentCategory]);

  // Find the category from either currentCategory or categories array
  const displayCategory =
    categoryId === currentCategory?.id
      ? currentCategory
      : categories.find((cat) => cat.id === categoryId);

  if (loading) {
    // Use global Redux loading state instead
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark"></div>
      </div>
    );
  }

  if (error) {
    // Use global Redux error state instead
    return (
      <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          <h3 className="ml-2 text-lg font-medium text-red-800 dark:text-red-300">
            Error loading category
          </h3>
        </div>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const { name, description, subcategories = [], icon } = displayCategory;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold capitalize mb-2 dark:text-white">
            {name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {description || `Browse all services related to ${name}`}
          </p>
        </div>

        {icon && (
          <div className="mt-4 md:mt-0">
            <Image
              src={icon}
              alt={name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full shadow-md"
            />
          </div>
        )}
      </div>

      {subcategories && subcategories.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800"
              >
                {service.icon && (
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={service.icon}
                      alt={service.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 dark:text-white">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {service.description}
                    </p>
                  )}

                  <Link
                    href={`/guest/kayaye-services/${categoryId}/${service.id}`}
                    className="inline-block bg-primary text-white dark:bg-primary-dark dark:text-black px-4 py-2 rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            No services available
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            There are currently no services listed under this category.
          </p>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/guest/kayaye-services"
          className="text-primary dark:text-primary-dark hover:underline flex items-center"
        >
          <span>← Back to all categories</span>
        </Link>
      </div>
    </div>
  );
}
