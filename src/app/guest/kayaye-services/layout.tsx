// app/dashboard/layout.tsx
import React from "react";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 text-black">
        {/* Navigation links or components */}
        <nav>
          <ul>
            <li>Errands mate service page</li>
            <li>preferences</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white text-black">{children}</main>
    </div>
  );
}
