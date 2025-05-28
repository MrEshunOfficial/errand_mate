// src/components/ui/ErrorMessage.tsx
import React from "react";
import {
  AlertTriangle,
  XCircle,
  RefreshCw,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorVariant = "error" | "warning" | "critical";
type ErrorSize = "sm" | "md" | "lg";

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  size?: ErrorSize;
  onRetry?: () => void;
  retryLabel?: string;
  onAction?: () => void;
  actionLabel?: string;
  showIcon?: boolean;
  className?: string;
  fullPage?: boolean;
}

const variantStyles: Record<
  ErrorVariant,
  {
    container: string;
    icon: string;
    title: string;
    message: string;
  }
> = {
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-400",
    title: "text-red-800",
    message: "text-red-700",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200",
    icon: "text-yellow-400",
    title: "text-yellow-800",
    message: "text-yellow-700",
  },
  critical: {
    container: "bg-red-100 border-red-300",
    icon: "text-red-500",
    title: "text-red-900",
    message: "text-red-800",
  },
};

const sizeStyles: Record<
  ErrorSize,
  {
    container: string;
    icon: string;
    title: string;
    message: string;
  }
> = {
  sm: {
    container: "p-3 rounded-md",
    icon: "h-4 w-4",
    title: "text-sm font-medium",
    message: "text-sm",
  },
  md: {
    container: "p-4 rounded-lg",
    icon: "h-5 w-5",
    title: "text-base font-medium",
    message: "text-sm",
  },
  lg: {
    container: "p-6 rounded-lg",
    icon: "h-6 w-6",
    title: "text-lg font-semibold",
    message: "text-base",
  },
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  variant = "error",
  size = "md",
  onRetry,
  retryLabel = "Try Again",
  onAction,
  actionLabel = "Go Back",
  showIcon = true,
  className = "",
  fullPage = false,
}) => {
  const variantClasses = variantStyles[variant];
  const sizeClasses = sizeStyles[size];

  const getIcon = () => {
    switch (variant) {
      case "warning":
        return (
          <AlertTriangle
            className={`${sizeClasses.icon} ${variantClasses.icon}`}
          />
        );
      case "critical":
        return (
          <XCircle className={`${sizeClasses.icon} ${variantClasses.icon}`} />
        );
      default:
        return (
          <AlertTriangle
            className={`${sizeClasses.icon} ${variantClasses.icon}`}
          />
        );
    }
  };

  const errorContent = (
    <div
      className={`
        border ${variantClasses.container} ${sizeClasses.container} ${className}
      `}
      role="alert">
      <div className="flex">
        {showIcon && <div className="flex-shrink-0">{getIcon()}</div>}
        <div className={showIcon ? "ml-3" : ""}>
          {title && (
            <h3 className={`${sizeClasses.title} ${variantClasses.title}`}>
              {title}
            </h3>
          )}
          <div
            className={`${title ? "mt-2" : ""} ${sizeClasses.message} ${
              variantClasses.message
            }`}>
            <p>{message}</p>
          </div>
          {(onRetry || onAction) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {onRetry && (
                <Button
                  variant="outline"
                  size={size === "lg" ? "default" : "sm"}
                  onClick={onRetry}
                  className="inline-flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {retryLabel}
                </Button>
              )}
              {onAction && (
                <Button
                  variant="outline"
                  size={size === "lg" ? "default" : "sm"}
                  onClick={onAction}
                  className="inline-flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {actionLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="max-w-md w-full">{errorContent}</div>
      </div>
    );
  }

  return errorContent;
};

// Specialized error components for common scenarios
interface NotFoundErrorProps {
  title?: string;
  message?: string;
  onGoHome?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({
  title = "Not Found",
  message = "The requested resource could not be found.",
  onGoHome,
  onGoBack,
  className = "",
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-full w-full">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M7 8h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-center gap-3">
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};

// Network error component
interface NetworkErrorProps {
  onRetry?: () => void;
  className?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  className = "",
}) => {
  return (
    <ErrorMessage
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      variant="error"
      size="md"
      onRetry={onRetry}
      retryLabel="Retry"
      className={className}
    />
  );
};

// Permission error component
interface PermissionErrorProps {
  resource?: string;
  onGoBack?: () => void;
  className?: string;
}

export const PermissionError: React.FC<PermissionErrorProps> = ({
  resource = "this resource",
  onGoBack,
  className = "",
}) => {
  return (
    <ErrorMessage
      title="Access Denied"
      message={`You don't have permission to access ${resource}.`}
      variant="warning"
      size="md"
      onAction={onGoBack}
      actionLabel="Go Back"
      className={className}
    />
  );
};

export default ErrorMessage;
