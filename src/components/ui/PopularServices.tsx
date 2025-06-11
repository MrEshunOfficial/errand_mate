"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, Users, RefreshCw, Package } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { IServiceDocument } from "@/models/category-service-models/serviceModel";

// Modern gradient colors for services when no image is available
const modernGradients = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-indigo-500 to-indigo-600",
  "from-red-500 to-red-600",
  "from-orange-500 to-orange-600",
];

const overlayGradients = [
  "from-blue-900/80 to-blue-700/60",
  "from-emerald-900/80 to-emerald-700/60",
  "from-amber-900/80 to-amber-700/60",
  "from-violet-900/80 to-violet-700/60",
  "from-rose-900/80 to-rose-700/60",
  "from-indigo-900/80 to-indigo-700/60",
  "from-red-900/80 to-red-700/60",
  "from-orange-900/80 to-orange-700/60",
];

interface ServiceCardProps {
  service: IServiceDocument;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const generateServiceHref = (service: IServiceDocument): string => {
    return `/services/${service._id.toString()}`;
  };

  // Use the same image validation logic as CategoryDetailsWithServicesPage
  const hasValidImage = service.serviceImage?.url;
  const fallbackGradient = modernGradients[index % modernGradients.length];
  const overlayGradient = overlayGradients[index % overlayGradients.length];

  return (
    <div className="group relative">
      {/* Floating Badge */}
      <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
        Popular
      </div>

      <Link
        href={generateServiceHref(service)}
        className="block relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl h-80 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
      >
        {/* Background Container */}
        <div className="absolute inset-0">
          {hasValidImage ? (
            // Image with fallback - matching CategoryDetailsWithServicesPage pattern
            <div className="relative h-full w-full">
              <Image
                src={service.serviceImage!.url}
                alt={service.serviceImage?.serviceName || service.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                priority={index < 2}
              />
              {/* Fallback gradient if image fails to load */}
              {imageError && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
                >
                  <div className="text-center text-white">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Service Image</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Pure gradient background when no image - matching CategoryDetailsWithServicesPage pattern
            <div
              className={`h-full w-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
            >
              <div className="text-center text-white">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-80" />
                <p className="text-sm opacity-80">Service</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced overlay with gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} group-hover:from-black/70 group-hover:to-black/40 transition-all duration-500 z-20`}
        />

        {/* Content with improved layout */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-30">
          {/* Top section - Service stats */}
          <div className="flex items-start justify-between"></div>

          {/* Bottom section - Service info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold mb-2 drop-shadow-lg leading-tight">
                {service.title}
              </h3>
              <p className="text-white/90 text-sm line-clamp-2 drop-shadow-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Action button */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 rounded-full px-4 py-2 text-sm font-semibold group-hover:translate-x-1">
                Request Service
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 transition-all duration-500 z-10" />
      </Link>
    </div>
  );
};

// Modern loading component
const LoadingState = () => (
  <section className="py-20 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Popular Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover our most requested services
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
        >
          View all services
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl backdrop-blur-sm">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-blue-600/20 animate-ping" />
        </div>
        <span className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading amazing services...
        </span>
      </div>
    </div>
  </section>
);

// Modern error state
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <section className="py-20 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Popular Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover our most requested services
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
        >
          View all services
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="text-center p-12 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl backdrop-blur-sm border border-red-100 dark:border-red-800/30">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn&apos;t load the popular services. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </section>
);

// Modern empty state
const EmptyState = () => (
  <section className="py-20 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Popular Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover our most requested services
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
        >
          View all services
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-3xl backdrop-blur-sm">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Popular Services Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Popular services will appear here as our community grows.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Browse All Services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default function PopularServices() {
  const { popularServices, loading, error, getPopularServices } = useServices();

  useEffect(() => {
    getPopularServices(8);
  }, [getPopularServices]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => getPopularServices(8)} />;
  if (!popularServices || popularServices.length === 0) return <EmptyState />;

  return (
    <section className="py-10 lg:py-16 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            ⭐ Most Requested
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Popular Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover the services that our community loves most. Trusted by
            hundreds of satisfied customers.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularServices.slice(0, 4).map((service, index) => (
            <ServiceCard
              key={service._id.toString()}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* View More Section */}
        {popularServices.length > 4 && (
          <div className="text-center mt-16">
            <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Discover More Amazing Services
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We have {popularServices.length - 4}+ more popular services
                waiting for you
              </p>
              <Link
                href="/services?popular=true"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore All Popular Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
