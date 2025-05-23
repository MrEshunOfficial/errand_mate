// app/dashboard/layout.tsx
import React from "react";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        {/* Navigation links or components */}
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
