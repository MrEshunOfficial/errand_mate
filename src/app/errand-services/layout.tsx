// app/errand-services/categories/layout.tsx
"use client";

import { useCategories } from "@/hooks/useCategory";
import { Home, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Category } from "@/store/type/service-categories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PublicCategoryLayoutProps {
  children: React.ReactNode;
}

export default function PublicCategoryLayout({
  children,
}: PublicCategoryLayoutProps): JSX.Element {
  const { categories, getCategories } = useCategories();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
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

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      if (isDesktop) {
        setSidebarExpanded(true);
        setSidebarOpen(false); // Desktop uses permanent sidebar
      } else if (isTablet) {
        setSidebarExpanded(false);
        setSidebarOpen(false);
      } else {
        setSidebarExpanded(true); // Mobile expanded when open
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarExpanded = () => setSidebarExpanded(!sidebarExpanded);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
            "lg:static lg:z-auto",
            // Mobile behavior
            "lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            // Width responsive behavior
            sidebarExpanded ? "w-64 sm:w-72" : "w-16 sm:w-20",
            // Desktop permanent sidebar
            "lg:flex lg:flex-shrink-0"
          )}
        >
          <div className="flex h-full w-full flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
              {sidebarExpanded && (
                <h2 className="text-base sm:text-lg font-semibold truncate">
                  Categories
                </h2>
              )}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebarExpanded}
                  className="hidden lg:flex h-7 w-7 sm:h-8 sm:w-8 p-0"
                  aria-label={
                    sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"
                  }
                >
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4 transition-transform",
                      sidebarExpanded ? "rotate-180" : "rotate-0"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="lg:hidden h-7 w-7 sm:h-8 sm:w-8 p-0"
                  aria-label="Close sidebar"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation Items - Scrollable */}
            <nav className="flex-1 overflow-y-auto p-2 sm:p-3">
              <div className="space-y-1">
                {/* Home Link */}
                <Link
                  href="/errand-services"
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/errand-services"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  {sidebarExpanded && <span>All Services</span>}
                </Link>

                {/* Categories Section */}
                <div className="pt-2">
                  {sidebarExpanded && (
                    <p className="px-2 sm:px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Categories
                    </p>
                  )}
                  <div className="space-y-1">
                    {categories.map((category: Category) => {
                      const isActive = pathname.includes(
                        category._id.toString()
                      );
                      return (
                        <Link
                          key={category._id.toString()}
                          href={`/errand-services/categories/${category._id.toString()}`}
                          className={cn(
                            "flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors hover:bg-accent hover:text-accent-foreground group",
                            isActive
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "text-foreground"
                          )}
                          title={
                            !sidebarExpanded ? category.categoryName : undefined
                          }
                        >
                          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-current flex-shrink-0 opacity-60" />
                          {sidebarExpanded && (
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">
                                {category.categoryName}
                              </p>
                              <p className="text-xs opacity-80 truncate">
                                {category.serviceCount}{" "}
                                {category.serviceCount === 1
                                  ? "service"
                                  : "services"}
                              </p>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Empty State */}
                {categories.length === 0 && sidebarExpanded && (
                  <div className="px-2 sm:px-3 py-6 sm:py-8 text-center">
                    <div className="text-muted-foreground">
                      <Home className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No categories available</p>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header with Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 lg:hidden border-b border-border bg-card/50 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold truncate">
              {isOnCategoryPage
                ? currentCategory?.categoryName || "Category"
                : "Categories"}
            </h1>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 lg:px-8 max-w-full">
              {/* Breadcrumb Navigation */}
              <div className="py-3 sm:py-4 lg:py-6">
                <Breadcrumb>
                  <BreadcrumbList className="flex-wrap">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/" className="flex items-center gap-1">
                          <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline text-xs sm:text-sm">
                            Home
                          </span>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden xs:block" />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href="/errand-services"
                          className="text-xs sm:text-sm"
                        >
                          Errand Services
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isOnCategoryPage ? (
                        <BreadcrumbLink asChild>
                          <Link
                            href="/errand-services/categories"
                            className="text-xs sm:text-sm"
                          >
                            Categories
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-xs sm:text-sm">
                          Categories
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {isOnCategoryPage && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage className="text-xs sm:text-sm">
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

              {/* Page Header - Desktop Only */}
              <header className="mb-4 sm:mb-6 lg:mb-8 space-y-1 sm:space-y-2 hidden lg:block">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-foreground">
                  {isOnCategoryPage
                    ? currentCategory?.categoryName || "Category Details"
                    : "Errand Services Categories"}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  {isOnCategoryPage
                    ? currentCategory?.description ||
                      "Explore services in this category"
                    : "Browse and explore our service categories"}
                </p>
              </header>

              {/* Dynamic Content */}
              <main className="pb-6 sm:pb-8 lg:pb-12 xl:pb-16">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
