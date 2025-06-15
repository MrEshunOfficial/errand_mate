// src/components/service-provider/ContactDetailsSection.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Phone, Mail, PhoneCall } from "lucide-react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";

interface ContactDetailsSectionProps {
  formData: ServiceProviderFormData;
  errors: FormFieldErrors;
  updateNestedField: <
    K extends keyof ServiceProviderFormData,
    NK extends keyof ServiceProviderFormData[K]
  >(
    field: K,
    nestedField: NK,
    value: ServiceProviderFormData[K][NK]
  ) => void;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
}

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  formData,
  errors,
  updateNestedField,
  validateField,
  disabled = false,
}) => {
  // Helper function to get nested field errors
  const getNestedFieldError = (field: string): string | undefined => {
    const contactErrors = errors.contactDetails;
    if (!contactErrors || typeof contactErrors !== "object") return undefined;

    return (contactErrors as Record<string, string>)[field];
  };

  const primaryContactError = getNestedFieldError("primaryContact");
  const secondaryContactError = getNestedFieldError("secondaryContact");
  const emailError = getNestedFieldError("email");
  const emergencyContactError = getNestedFieldError("emergencyContact");

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, "");

    // If it starts with +, keep it, otherwise remove any + characters
    if (cleaned.startsWith("+")) {
      return "+" + cleaned.slice(1).replace(/\+/g, "");
    }
    return cleaned.replace(/\+/g, "");
  };

  const handlePhoneChange = (
    field: keyof ServiceProviderFormData["contactDetails"],
    value: string
  ) => {
    const formatted = formatPhoneNumber(value);
    updateNestedField("contactDetails", field, formatted);
  };

  const handleFieldBlur = () => {
    validateField("contactDetails");
  };

  return (
    <div className="space-y-6">
      {/* Primary Contact */}
      <div className="space-y-2">
        <Label
          htmlFor="primaryContact"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Primary Contact Number</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="primaryContact"
          type="tel"
          value={formData.contactDetails.primaryContact}
          onChange={(e) => handlePhoneChange("primaryContact", e.target.value)}
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="+233 XX XXX XXXX"
          className={`${
            primaryContactError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {primaryContactError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {primaryContactError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your main contact number for business communications
        </p>
      </div>

      {/* Secondary Contact */}
      <div className="space-y-2">
        <Label
          htmlFor="secondaryContact"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <PhoneCall className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Secondary Contact Number</span>
            <span className="text-gray-400 text-xs">(Optional)</span>
          </div>
        </Label>
        <Input
          id="secondaryContact"
          type="tel"
          value={formData.contactDetails.secondaryContact}
          onChange={(e) =>
            handlePhoneChange("secondaryContact", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="+233 XX XXX XXXX"
          className={`${
            secondaryContactError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {secondaryContactError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {secondaryContactError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          An alternative contact number (can be a family member or friend)
        </p>
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Email Address</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.contactDetails.email}
          onChange={(e) =>
            updateNestedField("contactDetails", "email", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="your.email@example.com"
          className={`${
            emailError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {emailError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {emailError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Email address for business communications and notifications
        </p>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2">
        <Label
          htmlFor="emergencyContact"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span>Emergency Contact</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="emergencyContact"
          type="tel"
          value={formData.contactDetails.emergencyContact || ""}
          onChange={(e) =>
            handlePhoneChange("emergencyContact", e.target.value)
          }
          onBlur={handleFieldBlur}
          disabled={disabled}
          placeholder="+233 XX XXX XXXX"
          className={`${
            emergencyContactError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
        />
        {emergencyContactError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {emergencyContactError}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Emergency contact person (family member, friend, or trusted contact)
        </p>
      </div>

      {/* Contact Guidelines */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Contact Information Guidelines
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Primary contact is required for business communications</li>
          <li>• Emergency contact is required for urgent situations</li>
          <li>
            • Include country code for international numbers (e.g., +233 for
            Ghana)
          </li>
          <li>
            • Ensure all contact methods are active and monitored regularly
          </li>
          <li>
            • Emergency contact should be someone who can reach you quickly
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactDetailsSection;
