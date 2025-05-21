"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Package,
  Layers,
  Menu,
  X,
} from "lucide-react";
import LoadingPage from "./loading";
import { AppDispatch, RootState } from "@/store";
import { fetchCategories, clearError } from "@/store/category-redux-slice";
import { Category } from "@/store/type/serviceCategories";
import { Button } from "@/components/ui/button";

export default function KayayeServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasFetchedCategories, setHasFetchedCategories] = useState(false);

  // Helper function to create slug from category name
  const createSlug = (name: string) => {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
  };

  // Helper function to get category by slug
  const getCategoryBySlug = (slug: string) => {
    return categories.find(
      (category) => category.id === slug || createSlug(category.name) === slug
    );
  };

  useEffect(() => {
    // Only fetch categories if we haven't done so already
    if (!hasFetchedCategories) {
      dispatch(fetchCategories());
      setHasFetchedCategories(true);
    }

    // Cleanup error state when unmounting
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, hasFetchedCategories]);

  // Handle error state
  useEffect(() => {
    if (error) {
      // Redirect to error page with error info
      router.push(`/error?message=${encodeURIComponent(error)}`);
    }
  }, [error, router]);

  // Auto-expand category if its service is currently active
  useEffect(() => {
    if (categories.length > 0 && pathname) {
      const parts = pathname.split("/");
      if (parts.length >= 4) {
        const categorySlug = parts[3];
        const category = getCategoryBySlug(categorySlug);
        if (category) {
          setExpandedCategories((prev) => ({
            ...prev,
            [category.id]: true,
          }));
        }
      }
    }
  }, [categories, pathname]);

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const isServiceActive = (category: Category, serviceId: string) => {
    const categorySlug = createSlug(category.name);
    return pathname === `/guest/kayaye-services/${categorySlug}/${serviceId}`;
  };

  const isCategoryActive = (category: Category) => {
    const categorySlug = createSlug(category.name);
    return (
      pathname === `/guest/kayaye-services/${categorySlug}` ||
      pathname.startsWith(`/guest/kayaye-services/${categorySlug}/`)
    );
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  const renderCategories = () => (
    <ul className="space-y-1">
      {categories.map((category: Category) => {
        const categorySlug = createSlug(category.name);

        return (
          <li key={category.id} className="mb-1">
            <div
              className={`group relative transition-all duration-200 ${
                isCategoryActive(category)
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
              } rounded-lg overflow-hidden`}>
              <Link
                href={`/guest/kayaye-services/${categorySlug}`}
                className="flex items-center justify-between p-3 w-full">
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2 rounded-md ${
                      isCategoryActive(category)
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                    <Layers size={18} />
                  </span>
                  <span
                    className={`font-medium transition-colors capitalize ${
                      isCategoryActive(category)
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-200"
                    }`}>
                    {category.name}
                  </span>
                </div>

                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <button
                      onClick={(e) => toggleCategory(category.id, e)}
                      className={`p-2 rounded-full transition-all ${
                        isCategoryActive(category)
                          ? "text-blue-600 hover:bg-blue-200 dark:text-blue-300 dark:hover:bg-blue-800/50"
                          : "text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700/70"
                      }`}
                      aria-label={
                        expandedCategories[category.id]
                          ? "Collapse category"
                          : "Expand category"
                      }>
                      {expandedCategories[category.id] ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  )}
              </Link>

              {expandedCategories[category.id] &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div className="px-3 pb-2">
                    <ul className="ml-5 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      {category.subcategories.map((service) => (
                        <li key={service.id}>
                          <Link
                            href={`/guest/kayaye-services/${categorySlug}/${service.id}`}
                            className={`flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200 ${
                              isServiceActive(category, service.id)
                                ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200"
                            }`}>
                            <Package size={15} />
                            <span>{service.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  // If loading, show the dedicated loading page
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileNav}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}>
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl flex flex-col lg:flex-row gap-6">
        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={toggleMobileNav}></div>
          <nav className="relative h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-xl flex flex-col">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Services
              </h2>
              <Button
                onClick={toggleMobileNav}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {categories.length === 0 && (
                <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                  <p>No service categories found</p>
                </div>
              )}

              {categories.length > 0 && renderCategories()}
            </div>
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <nav className="hidden lg:block w-72 xl:w-80 shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Service Categories
            </h2>
          </div>

          <div className="p-4 h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
            {categories.length === 0 && (
              <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                <p>No service categories found</p>
              </div>
            )}

            {categories.length > 0 && renderCategories()}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
