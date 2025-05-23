// app/dashboard/layout.tsx
import React from "react";
import { CategorySidebar } from "./CategorySidebar";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar with Categories */}
      <CategorySidebar />

      {/* Main content */}
      <main className="flex-1 p-6 bg-white text-black">{children}</main>
    </div>
  );
}
