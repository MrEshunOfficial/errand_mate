"use client";

import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          {/* Circular skeleton */}
          <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-3 animate-pulse" />

        {/* Text skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto animate-pulse" />

        {/* Progress bar skeleton */}
        <div className="mt-6">
          <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden animate-pulse" />
          <div className="mt-4 flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>Loading content...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
