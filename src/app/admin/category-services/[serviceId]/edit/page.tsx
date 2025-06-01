"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/store/type/service-categories";
import { ServiceForm } from "../../ServiceForm";

const EditServicePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = params.serviceId as string;
  const categoryId = searchParams.get("categoryId");

  const {
    selectedService,
    editService,
    getServiceById,
    loading,
    error,
    clearServiceError,
  } = useServices();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [serviceData, setServiceData] = useState<Service | null>(null);

  // Fetch service data on component mount
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        toast.error("Service ID is required");
        router.push("/admin");
        return;
      }

      try {
        setIsInitialLoading(true);
        clearServiceError();

        const result = await getServiceById(serviceId, true); // Include category data

        if (result.meta.requestStatus === "fulfilled") {
          // Ensure categoryId is a string for Service type compatibility
          const payload = result.payload as Service | undefined;
          setServiceData(
            payload
              ? {
                  ...payload,
                  categoryId:
                    typeof payload.categoryId === "string"
                      ? payload.categoryId
                      : payload.categoryId !== undefined &&
                        payload.categoryId !== null
                      ? String(payload.categoryId)
                      : "",
                }
              : null
          );
        } else {
          throw new Error("Failed to fetch service");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service data");
        router.push("/admin");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchService();
  }, [serviceId, getServiceById, clearServiceError, router]);

  // Update local state when selected service changes
  useEffect(() => {
    if (selectedService) {
      setServiceData({
        ...selectedService,
        categoryId:
          typeof selectedService.categoryId === "string"
            ? selectedService.categoryId
            : selectedService.categoryId?.toString?.() ?? "",
      });
    }
  }, [selectedService]);

  const handleUpdateService = async (
    data:
      | import("@/store/type/service-categories").CreateServiceInput
      | import("@/store/type/service-categories").UpdateServiceInput
  ) => {
    // Only proceed if data is UpdateServiceInput (has _id)
    if (!("_id" in data)) {
      toast.error("Invalid service data: missing _id for update.");
      return;
    }
    try {
      const result = await editService(serviceId, data);

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Service updated successfully!");

        // Redirect back to service details or services list
        if (categoryId) {
          router.push(`/admin/categories/${categoryId}/services`);
        } else {
          router.push("/admin");
        }
      } else {
        throw new Error("Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service. Please try again.");
      throw error; // Re-throw to let ServiceForm handle the loading state
    }
  };

  const handleCancel = () => {
    // Navigate back to the previous page or services list
    if (categoryId) {
      router.push(`/categories/${categoryId}/services`);
    } else if (serviceData) {
      router.push(`/services/${serviceData._id}`);
    } else {
      router.push("/services");
    }
  };

  // Loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center space-x-6 max-w-md mx-4">
          <div className="flex-shrink-0">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Loading Service
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Please wait while we fetch the service details...
            </p>
            <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              This may take a few moments
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full mx-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Service Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The service you&apos;re trying to edit could not be found or there
            was an error loading it. This might be due to insufficient
            permissions or the service may have been deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/services")}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
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
              Back to Services
            </button>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

            {serviceData && (
              <>
                <a
                  href={`/services/${serviceData._id}`}
                  className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 whitespace-nowrap max-w-32 truncate"
                  title={serviceData.title}
                >
                  <svg
                    className="w-4 h-4 mr-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {serviceData.title}
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

            <span className="flex items-center text-orange-600 dark:text-orange-400 font-semibold whitespace-nowrap">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </span>
          </nav>

          {/* Page Title Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl mr-4">
                    <svg
                      className="w-6 h-6 text-orange-600 dark:text-orange-400"
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
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                      Edit Service
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
                      Modify the service information below to update
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  Update the service information below
                </p>

                {serviceData && (
                  <div className="mt-4 space-y-3">
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Current Service: {serviceData.title}
                    </div>

                    {categoryId && (
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 ml-2">
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
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Service Form Container */}
          {serviceData && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-0">
                <ServiceForm
                  mode="edit"
                  initialData={serviceData}
                  categoryId={categoryId || serviceData.categoryId}
                  onSubmit={handleUpdateService}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          )}
        </main>

        {/* Loading Overlay for Updates */}
        {loading && !isInitialLoading && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4 max-w-sm mx-4">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-orange-200 dark:border-orange-800 border-t-orange-600 dark:border-t-orange-400"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Updating Service
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we save your changes...
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

export default EditServicePage;
