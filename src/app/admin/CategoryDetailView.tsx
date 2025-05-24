// components/CategoryDetailView.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Category,
  CategoryWithServices,
  Service,
} from "@/store/type/service-categories";

interface CategoryDetailViewProps {
  category: Category | CategoryWithServices;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
}) => {
  const hasServices = "services" in category;
  const services = hasServices ? category.services : [];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {category.icon && <div className="text-4xl">{category.icon}</div>}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/admin/${category.id}/edit`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors"
            >
              Edit Category
            </Link>
            <Link
              href={`/admin/${category.id}/services/new`}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded transition-colors"
            >
              Add Service
            </Link>
          </div>
        </div>

        {/* Category Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Service Count:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {category.serviceCount || services.length || 0}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Created:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {formatDate(category.createdAt)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Last Updated:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {formatDate(category.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Services in this Category
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              📝
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No services yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This category doesn&apos;t have any services. Start by adding your
              first service.
            </p>
            <Link
              href={`/admin/${category.id}/services/new`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors"
            >
              Add First Service
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {services.map((service: Service) => (
              <div
                key={service.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {service.icon && (
                        <span className="text-2xl">{service.icon}</span>
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Price:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {formatCurrency(
                            service.pricing.basePrice,
                            service.pricing.currency
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Status:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            service.isActive
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Popular:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            service.popular
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {service.popular ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Locations:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {service.locations.length} location
                          {service.locations.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
