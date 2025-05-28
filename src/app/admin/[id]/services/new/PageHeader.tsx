// src/components/ui/PageHeader.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.href} className="flex items-center">
                  {index === 0 && (
                    <Home
                      className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    />
                  )}

                  {breadcrumb.current ? (
                    <span
                      className="text-gray-500 dark:text-gray-300 font-medium"
                      aria-current="page">
                      {breadcrumb.label}
                    </span>
                  ) : (
                    <Link
                      href={breadcrumb.href}
                      className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors duration-200">
                      {breadcrumb.label}
                    </Link>
                  )}

                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight
                      className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
              <div className="flex items-center space-x-3">{actions}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Variant with simpler layout for smaller headers
interface SimplePageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SimplePageHeader: React.FC<SimplePageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
