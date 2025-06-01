// app/admin/layout.tsx
"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCategories } from "@/hooks/useCategory";
import Image from "next/image";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { categories, loading, getCategories } = useCategories();

  // Fetch categories on component mount
  useEffect(() => {
    getCategories({ limit: 50 }); // Fetch more categories for the sidebar
  }, [getCategories]);

  const mainNavItems = [
    {
      href: "/admin",
      label: "All Categories",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      href: "/admin/categories/new",
      label: "Add Category",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/categories") {
      return pathname === href || pathname === "/admin/categories/";
    }
    return pathname?.startsWith(href);
  };

  const isCategoryActive = (categoryId: string) => {
    return pathname?.includes(`/admin/categories/${categoryId}`);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Modern Sidebar */}
      <aside className="w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl flex flex-col">
        {/* Elegant Header */}
        <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Management Hub
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Main Actions
            </h3>
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                        : "text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <div
                      className={`transition-transform duration-200 ${
                        isActive(item.href)
                          ? "scale-110"
                          : "group-hover:scale-110"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories ({categories.length})
              </h3>
              {loading && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            <ul className="space-y-1 max-h-96 overflow-y-auto">
              {categories.map((category) => (
                <li key={category._id.toString()}>
                  <Link
                    href={`/admin/categories/${category._id}`}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isCategoryActive(category._id.toString())
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500 dark:bg-blue-900/20 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/30"
                    }`}
                    title={category.description || category.categoryName}
                  >
                    {/* Category Icon/Image or Placeholder */}
                    {category.catImage?.url ? (
                      <Image
                        src={category.catImage.url}
                        alt={category.catImage.catName || category.categoryName}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-md flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-gray-500 dark:text-gray-400"
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
                      </div>
                    )}

                    {/* Category Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {category.categoryName}
                        </span>
                        {category.serviceCount !== undefined && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isCategoryActive(category._id.toString())
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {category.serviceCount}
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Empty State */}
            {!loading && categories.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  No categories found
                </p>
                <Link
                  href="/admin/categories/new"
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Create your first category
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-blue-200/50 dark:border-gray-600/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Need help?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Check documentation
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 min-h-full">{children}</div>
      </main>
    </div>
  );
}
