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

  const categoryId = resolvedParams.category;
  const serviceId = resolvedParams.service;

  const { categories } = useSelector((state: RootState) => state.categories);

  // Find the current category and service based on resolved params
  const category = categories.find((cat) => cat.id === categoryId);
  const service = category?.subcategories?.find((svc) => svc.id === serviceId);

  if (!category || !service) {
    return (
      <div className="py-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Service not found
        </h2>
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

      {service.id && (
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          This is a special service that requires additional information.
        </p>
      )}

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          Book Service
        </button>
      </div>
    </div>
  );
}
