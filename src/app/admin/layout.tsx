// app/dashboard/layout.tsx
import React from "react";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      <aside className="w-full p-4 bg-gray-100 border-b md:w-64 md:border-b-0 md:border-r dark:bg-gray-800 dark:border-gray-700">
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/dashboard/settings"
                className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
