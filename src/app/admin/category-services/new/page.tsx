"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useServices } from "@/hooks/useServices";
import {
  CreateServiceInput,
  UpdateServiceInput,
} from "@/store/type/service-categories";
import { ServiceForm } from "../ServiceForm";

const CreateServicePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { addService, loading } = useServices();

  const handleCreateService = async (
    serviceData: CreateServiceInput | UpdateServiceInput
  ) => {
    try {
      // Ensure required fields for CreateServiceInput are present
      if (!serviceData.title) {
        throw new Error("Title is required");
      }

      // You may want to do further type checks here if needed
      const result = await addService(serviceData as CreateServiceInput);

      // Check if the action was successful
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Service created successfully!");

        // Redirect to services list or category page
        if (categoryId) {
          router.push(`/admin/categories/${categoryId}`);
        } else {
          router.push("/admin/category-services/new");
        }
      } else {
        throw new Error("Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service. Please try again.");
      throw error; // Re-throw to let ServiceForm handle the loading state
    }
  };

  const handleCancel = () => {
    // Navigate back to the previous page or services list
    if (categoryId) {
      router.push(`/admin/categories/${categoryId}`);
    } else {
      router.push("/admin/category-services/new");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-8 lg:mb-12">
          {/* Breadcrumb Navigation */}
          <nav
            className="flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto pb-2"
            aria-label="Breadcrumb"
          >
            <a
              href="/services"
              className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 whitespace-nowrap"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Services
            </a>

            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>

            {categoryId && (
              <>
                <a
                  href={`/categories/${categoryId}/services`}
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Category Services
                </a>

                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}

            <span className="flex items-center text-gray-900 dark:text-gray-100 font-semibold whitespace-nowrap">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Service
            </span>
          </nav>

          {/* Page Title Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                      Create New Service
                    </h1>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Fill out the form below to add a new service
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  Add a new service to{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {categoryId
                      ? "the selected category"
                      : "your service catalog"}
                  </span>
                </p>

                {categoryId && (
                  <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    <svg
                      className="w-3.5 h-3.5 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Category: {categoryId}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 ml-6">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Service Form Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 px-6 py-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Service Information
                </h2>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Please provide all required information for the new service
              </p>
            </div>

            <div className="p-0">
              <ServiceForm
                mode="create"
                categoryId={categoryId || undefined}
                onSubmit={handleCreateService}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </main>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4 max-w-sm mx-4">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Creating Service
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we process your request...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Floating Panel */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Esc to cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;
