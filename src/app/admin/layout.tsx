// app/dashboard/layout.tsx
import React from "react";
import { CategorySidebar } from "./CategorySidebar";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with Categories */}
      <CategorySidebar />
      {/* Main content */}
      <main className="flex-1 p-6 bg-white dark:bg-gray-900 text-black dark:text-white">
        {children}
      </main>
    </div>
  );
}
