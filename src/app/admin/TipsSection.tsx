import React from "react";
import { ChevronRight } from "lucide-react";

const TipsSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-md border border-blue-100 dark:border-blue-900/30">
      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-3">
        Tips & Best Practices
      </h3>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full mr-2 mt-1">
            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </span>
          <span className="text-sm text-blue-800 dark:text-blue-200">
            Create logical categories to organize your services
          </span>
        </li>
        <li className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full mr-2 mt-1">
            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </span>
          <span className="text-sm text-blue-800 dark:text-blue-200">
            Use descriptive names for better search results
          </span>
        </li>
        <li className="flex items-start">
          <span className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full mr-2 mt-1">
            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </span>
          <span className="text-sm text-blue-800 dark:text-blue-200">
            Regularly review and update your categories
          </span>
        </li>
      </ul>
    </div>
  );
};

export default TipsSection;
