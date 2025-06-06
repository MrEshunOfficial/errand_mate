// app/errand-services/categories/layout.tsx
"use client";

import { useCategories } from "@/hooks/useCategory";
import { Home } from "lucide-react";
import Link from "next/link";
import { JSX, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Category } from "@/store/type/service-categories";

interface PublicCategoryLayoutProps {
  children: React.ReactNode;
}

export default function PublicCategoryLayout({
  children,
}: PublicCategoryLayoutProps): JSX.Element {
  const { categories, getCategories } = useCategories();
  const pathname = usePathname();

  // Get current category for breadcrumb
  const getCurrentCategory = (): Category | null => {
    const pathSegments = pathname.split("/");
    const categoryId = pathSegments[pathSegments.length - 1];

    if (categoryId && categoryId !== "categories") {
      return (
        categories.find((cat) => cat._id.toString() === categoryId) || null
      );
    }
    return null;
  };

  const currentCategory = getCurrentCategory();
  const isOnCategoryPage =
    pathname.includes("/categories/") && pathname.split("/").length > 3;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        await getCategories({ limit: 20 });
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchData();
  }, [getCategories]);

  return (
    <div className="container mx-auto max-w-7xl min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Main Content Container */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div
          className={cn(
            "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0",
            "bg-white dark:bg-slate-900",
            "border-gray-200 dark:border-slate-800",
            "shadow-sm"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {currentCategory?.catImage?.url && (
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src={currentCategory.catImage.url}
                  alt={
                    currentCategory.catImage.catName ||
                    currentCategory.categoryName
                  }
                  fill
                  className="object-cover rounded"
                  sizes="24px"
                />
              </div>
            )}
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {isOnCategoryPage
                ? currentCategory?.categoryName || "Category"
                : "Categories"}
            </h1>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 max-w-full">
            {/* Breadcrumb Navigation */}
            <div className="py-4 lg:py-6">
              <Breadcrumb>
                <BreadcrumbList className="flex-wrap">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/"
                        className="flex items-center gap-1 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline text-xs sm:text-sm">
                          Home
                        </span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden xs:block text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/errand-services"
                        className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Errand Services
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    {isOnCategoryPage ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href="/errand-services/categories"
                          className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          Categories
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                        Categories
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {isOnCategoryPage && (
                    <>
                      <BreadcrumbSeparator className="text-gray-400" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                          <span className="truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-none">
                            {currentCategory?.categoryName || "Category"}
                          </span>
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Page Header */}
            <header className="mb-6 lg:mb-8 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-4">
                {isOnCategoryPage && currentCategory?.catImage?.url && (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={currentCategory.catImage.url}
                      alt={
                        currentCategory.catImage.catName ||
                        currentCategory.categoryName
                      }
                      fill
                      className="object-cover rounded-lg shadow-sm"
                      sizes="48px"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
                    {isOnCategoryPage
                      ? currentCategory?.categoryName || "Category Details"
                      : "Errand Services Categories"}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 max-w-3xl mt-1">
                    {isOnCategoryPage
                      ? currentCategory?.description ||
                        "Explore services in this category"
                      : "Browse and explore our comprehensive service categories"}
                  </p>
                </div>
              </div>
            </header>

            {/* Dynamic Content */}
            <main className="pb-8 lg:pb-12 xl:pb-16">
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
