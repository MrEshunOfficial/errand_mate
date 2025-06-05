// app/errand-services/categories/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link
          href="/"
          className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/errand-services/categories"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          Category Details
        </span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Category Details
      </h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Category ID:
        </h2>
        <code className="text-blue-600 dark:text-blue-400 font-mono text-lg bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded border">
          {categoryId}
        </code>
      </div>

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This dynamic page receives the category ID from the URL path:
          <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded ml-1">
            /errand-services/categories/{categoryId}
          </span>
        </p>
      </div>
    </>
  );
}
