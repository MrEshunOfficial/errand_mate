"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Package,
} from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { IServiceDocument } from "@/models/category-service-models/serviceModel";
import Link from "next/link";

export default function Errands_mateFooter() {
  const currentYear = new Date().getFullYear();
  const { services, loading, error, getServices } = useServices();
  const [displayServices, setDisplayServices] = useState<IServiceDocument[]>(
    []
  );
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch services on component mount
  useEffect(() => {
    getServices({ limit: 5, isActive: true });
  }, [getServices]);

  // Update display services when services data changes
  useEffect(() => {
    if (services && services.length > 0) {
      // Take first 5 services for footer display
      setDisplayServices(services.slice(0, 5));
    }
  }, [services]);

  const generateServiceHref = (service: IServiceDocument): string => {
    return `/services/${service._id.toString()}`;
  };

  const handleImageError = (serviceId: string) => {
    setImageErrors((prev) => new Set(prev).add(serviceId));
  };

  return (
    <footer className="bg-gray-900 dark:bg-white border-t border-gray-800 dark:border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
              Errands mate
            </h3>
            <p className="text-gray-300 dark:text-gray-600 mb-6">
              Connecting people with reliable help for everyday errands across
              Africa.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 dark:text-gray-500 dark:hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Company Links */}
            <div>
              <h4 className="font-bold mb-4 text-white dark:text-gray-900">
                Company
              </h4>
              <ul className="space-y-2">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Services Links */}
            <div>
              <h4 className="font-bold mb-4 text-white dark:text-gray-900">
                Our Services
              </h4>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="h-4 bg-gray-700 dark:bg-gray-300 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  <p>Unable to load services</p>
                </div>
              ) : displayServices.length > 0 ? (
                <ul className="space-y-3">
                  {displayServices.map((service) => {
                    const serviceId = service._id.toString();
                    const hasImageError = imageErrors.has(serviceId);
                    const imageUrl = service.serviceImage?.url;
                    const hasValidImage = imageUrl && !hasImageError;

                    return (
                      <li key={serviceId}>
                        <a
                          href={generateServiceHref(service)}
                          className="text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-600 transition-colors flex items-center group"
                        >
                          <div className="flex items-center space-x-2 w-full">
                            {/* Service Image or Icon */}
                            <div className="flex-shrink-0 w-6 h-6 relative">
                              {hasValidImage ? (
                                <Image
                                  src={imageUrl}
                                  alt={
                                    service?.serviceImage?.serviceName ||
                                    service.title
                                  }
                                  width={24}
                                  height={24}
                                  className="rounded object-cover"
                                  onError={() => handleImageError(serviceId)}
                                />
                              ) : (
                                <Package
                                  size={16}
                                  className="opacity-60 group-hover:opacity-100"
                                />
                              )}
                            </div>

                            {/* Service Title */}
                            <span className="truncate text-sm">
                              {service.title}
                            </span>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                  <li className="pt-2">
                    <Link
                      href="/services"
                      className="text-blue-400 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm font-medium inline-flex items-center group"
                    >
                      View All Services
                      <ArrowRight
                        size={12}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </li>
                </ul>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  <p>No services available</p>
                </div>
              )}
            </div>

            {/* Support Links + Contact */}
            <div>
              <h4 className="font-bold mb-4 text-white dark:text-gray-900">
                Support
              </h4>
              <ul className="space-y-2">
                {[
                  "Help Center",
                  "Safety",
                  "Terms of Service",
                  "Privacy Policy",
                  "FAQs",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 dark:text-gray-600 dark:hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>

              <h4 className="font-bold mt-6 mb-2 text-white dark:text-gray-900">
                Contact
              </h4>
              <div className="text-gray-300 dark:text-gray-600">
                <p>support@errandsmate.com</p>
                <p>+123 456 7890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-700 dark:border-gray-200 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            &copy; {currentYear} Project Errands mate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
