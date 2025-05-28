// src/components/ui/LoadingSpinner.tsx
import React from "react";
import { Loader2 } from "lucide-react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "default" | "white" | "primary" | "secondary";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const variantClasses: Record<SpinnerVariant, string> = {
  default: "text-gray-600",
  white: "text-white",
  primary: "text-blue-600",
  secondary: "text-gray-400",
};

const textSizeClasses: Record<SpinnerSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  className = "",
  text,
  fullScreen = false,
  overlay = false,
}) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        aria-hidden="true"
      />
      {text && (
        <p
          className={`${textSizeClasses[size]} ${variantClasses[variant]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center ${
          overlay
            ? "bg-black bg-opacity-50 backdrop-blur-sm z-50"
            : "bg-white z-40"
        }`}
        role="status"
        aria-label="Loading">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="Loading">
      {spinnerContent}
    </div>
  );
};

// Inline spinner for buttons and smaller components
interface InlineSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

export const InlineSpinner: React.FC<InlineSpinnerProps> = ({
  size = "sm",
  variant = "default",
  className = "",
}) => {
  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};

// Page loading component with skeleton-like appearance
interface PageLoadingProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  title = "Loading...",
  subtitle,
  className = "",
}) => {
  return (
    <div
      className={`min-h-[400px] flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LoadingSpinner size="lg" text={title} />
      {subtitle && (
        <p className="text-sm text-gray-500 text-center max-w-md">{subtitle}</p>
      )}
    </div>
  );
};

// Card loading placeholder
export const CardLoading: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Table loading rows
interface TableLoadingProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  rows = 5,
  columns = 4,
  className = "",
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
