"use client";

import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fetching service categories and content
        </p>

        {/* Add a loading progress animation */}
        <div className="mt-6">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full w-1/2 animate-pulse"></div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Preparing data...</span>
            <span>Please wait</span>
          </div>
        </div>
      </div>
    </div>
  );
}
