"use client";

import { useCategories } from "@/hooks/useCategory";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PublicCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();
  const { categories, getCategories, getCategoriesWithCounts } =
    useCategories();

  // Fetch categories and their service counts on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch both regular categories and service counts
      await Promise.all([getCategories({ limit: 5 })]);
    };

    fetchData();
  }, [getCategories, getCategoriesWithCounts]);

  return (
    <main className="container mx-auto p-4 flex flex-col min-h-screen">
      <header className="w-full flex items-center">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link
            href="/"
            className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="text-gray-900 dark:text-gray-100 font-medium">
            Categories & Services
          </span>
        </nav>
      </header>
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Errand Services Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id.toString()}
              href={`/errand-services/categories/${category._id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.categoryName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {category.description || "No description available"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                {category.serviceCount}{" "}
                {category.serviceCount === 1 ? "service" : "services"}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section>{children}</section>
    </main>
  );
}
