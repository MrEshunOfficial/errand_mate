// src/components/service-provider/IdentificationSection.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  FileText,
  Eye,
  AlertCircle,
  CreditCard,
  Hash,
  ImageIcon,
} from "lucide-react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";

interface IdentificationSectionProps {
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

const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  formData,
  errors,
  updateNestedField,
  validateField,
  disabled = false,
}) => {
  const idDetails = formData.idDetails || {
    idType: "",
    idNumber: "",
    idFile: { url: "", fileName: "" },
  };

  // Helper function to get nested field errors (similar to ContactDetailsSection)
  const getNestedFieldError = (field: string): string | undefined => {
    const idDetailsErrors = errors.idDetails;
    if (!idDetailsErrors || typeof idDetailsErrors !== "object")
      return undefined;

    return (idDetailsErrors as Record<string, string>)[field];
  };

  const idTypeError = getNestedFieldError("idType");
  const idNumberError = getNestedFieldError("idNumber");
  const idFileError = getNestedFieldError("idFile");

  const handleFieldBlur = () => {
    validateField("idDetails");
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("File must be JPG, PNG, or PDF format");
        return;
      }

      // In a real implementation, you would upload the file and get a URL
      const fileUrl = URL.createObjectURL(file);
      updateNestedField("idDetails", "idFile", {
        url: fileUrl,
        fileName: file.name,
      });
    } else {
      updateNestedField("idDetails", "idFile", {
        url: "",
        fileName: "",
      });
    }
    // Trigger validation after file change
    setTimeout(() => validateField("idDetails"), 0);
  };

  const removeFile = () => {
    updateNestedField("idDetails", "idFile", {
      url: "",
      fileName: "",
    });
    // Trigger validation after file removal
    setTimeout(() => validateField("idDetails"), 0);
  };

  const previewFile = (imageUrl: string) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* ID Type and Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Type */}
        <div className="space-y-2">
          <Label
            htmlFor="idType"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>ID Type</span>
              <span className="text-red-500">*</span>
            </div>
          </Label>
          <Select
            value={idDetails.idType || ""}
            onValueChange={(value) => {
              updateNestedField("idDetails", "idType", value);
              // Trigger validation after change
              setTimeout(() => validateField("idDetails"), 0);
            }}
            disabled={disabled}
          >
            <SelectTrigger
              className={`h-12 ${
                idTypeError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
            >
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national_id">National ID</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="drivers_license">
                Driver&apos;s License
              </SelectItem>
              <SelectItem value="voter_id">Voter ID</SelectItem>
            </SelectContent>
          </Select>
          {idTypeError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {idTypeError}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select your primary identification document type
          </p>
        </div>

        {/* ID Number */}
        <div className="space-y-2">
          <Label
            htmlFor="idNumber"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>ID Number</span>
              <span className="text-red-500">*</span>
            </div>
          </Label>
          <Input
            id="idNumber"
            type="text"
            placeholder="Enter ID number"
            value={idDetails.idNumber || ""}
            onChange={(e) =>
              updateNestedField("idDetails", "idNumber", e.target.value)
            }
            onBlur={handleFieldBlur}
            disabled={disabled}
            className={`h-12 ${
              idNumberError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
            } ${disabled ? "bg-gray-50 dark:bg-gray-800" : ""}`}
          />
          {idNumberError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {idNumberError}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter the number exactly as it appears on your ID
          </p>
        </div>
      </div>

      {/* ID Document Upload */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>ID Document Image</span>
            <span className="text-red-500">*</span>
          </div>
        </Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Upload a clear photo of your identification document. File should be
          in JPG, PNG, or PDF format and less than 5MB.
        </p>

        <div className="max-w-md">
          {/* Single File Upload */}
          <div className="space-y-3">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                idFileError
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              {idDetails.idFile?.url ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {idDetails.idFile.fileName}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => previewFile(idDetails.idFile.url)}
                      className="h-8 px-3 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      disabled={disabled}
                      className="h-8 px-3 text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      className="h-8 px-3 text-xs"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*,.pdf";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          handleFileUpload(file || null);
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload ID Document
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG, or PDF up to 5MB
                  </p>
                </div>
              )}
            </div>
            {idFileError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {idFileError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Identification Guidelines */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Identification Guidelines
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• ID type and number are required for verification</li>
          <li>• Upload a clear, high-quality image of your ID document</li>
          <li>• Ensure all text and details on the ID are clearly visible</li>
          <li>• Accepted formats: JPG, PNG, PDF (maximum 5MB)</li>
          <li>• Document will be verified for authenticity</li>
          <li>• Fraudulent documents will result in account suspension</li>
        </ul>
      </div>

      {/* Verification Note */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              <strong>Important:</strong> All identification documents will be
              verified for authenticity. Ensure that the image is clear,
              well-lit, and all text is readable. Any fraudulent documents will
              result in immediate account suspension.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationSection;
