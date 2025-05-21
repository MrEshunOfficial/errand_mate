"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ServicePageProps {
  params: Promise<{
    category: string;
    service: string;
  }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  // Use React.use() to unwrap the params promise
  const resolvedParams = React.use(params);

  const categorySlug = resolvedParams.category;
  const serviceId = resolvedParams.service;

  const { categories } = useSelector((state: RootState) => state.categories);

  // Helper function to create slug from category name
  const createSlug = (name: string) => {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
  };

  // Find the current category by slug (name-based) or fallback to ID
  const category = categories.find(
    (cat) => cat.id === categorySlug || createSlug(cat.name) === categorySlug
  );

  const service = category?.subcategories?.find((svc) => svc.id === serviceId);

  if (!category || !service) {
    return (
      <div className="py-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Service not found
        </h2>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Category: {categorySlug} | Service: {serviceId}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {service.name}
      </h1>

      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Category: {category.name}
      </div>

      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {service.description ||
          `This is a special service that requires additional information.`}
      </p>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Service ID: {service.id}
      </div>

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Book Service
        </button>
      </div>
    </div>
  );
}
