// src/components/service-provider/BasicInformationSection.tsx
"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";

interface BasicInformationSectionProps {
  formData: {
    userId: string;
    fullName: string;
  };
  errors: FormFieldErrors;
  updateField: <K extends keyof ServiceProviderFormData>(
    field: K,
    value: ServiceProviderFormData[K]
  ) => void;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
}

export const BasicInformationSection: React.FC<
  BasicInformationSectionProps
> = ({
  formData,
  updateField,
  validateField,
  getFieldError,
  disabled = false,
}) => {
  const { data: session, status } = useSession();

  // Auto-populate from session if available
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Set userId from session if not already set
      if (!formData.userId && session.user.id) {
        updateField("userId", session.user.id);
      }

      // Set fullName from session if not already set
      if (!formData.fullName && session.user.name) {
        updateField("fullName", session.user.name);
      }
    }
  }, [session, status, formData.userId, formData.fullName, updateField]);

  const userIdError = getFieldError("userId");
  const fullNameError = getFieldError("fullName");

  return (
    <div className="space-y-6">
      {/* Session Info Display */}
      {status === "authenticated" && session?.user && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Session Information
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Information automatically populated from your session
              </p>
              <div className="mt-2 space-y-1 text-xs text-blue-600 dark:text-blue-400">
                <div>Email: {session.user.email}</div>
                {session.user.name && <div>Name: {session.user.name}</div>}
                {session.user.id && <div>User ID: {session.user.id}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User ID Field */}
      <div className="space-y-2">
        <Label
          htmlFor="userId"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          User ID <span className="text-red-500">*</span>
        </Label>
        <Input
          id="userId"
          type="text"
          value={formData.userId}
          onChange={(e) => updateField("userId", e.target.value)}
          onBlur={() => validateField("userId")}
          disabled={
            disabled || (status === "authenticated" && !!session?.user?.id)
          }
          placeholder="User ID will be auto-populated from session"
          className={`${
            userIdError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {userIdError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {userIdError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This field is automatically populated from your session information
        </p>
      </div>

      {/* Full Name Field */}
      <div className="space-y-2">
        <Label
          htmlFor="fullName"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          onBlur={() => validateField("fullName")}
          disabled={disabled}
          placeholder="Enter your full name"
          className={`${
            fullNameError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {fullNameError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {fullNameError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your full legal name as it appears on official documents
        </p>
      </div>

      {/* Session Status Alert */}
      {status === "loading" && (
        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-300">
            Loading session information...
          </AlertDescription>
        </Alert>
      )}

      {status === "unauthenticated" && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to create a service provider profile. Please
            log in and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BasicInformationSection;
