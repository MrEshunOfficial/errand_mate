// src/components/forms/ClientForm/steps/IdentificationStep.tsx
import React, { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { ClientFormData } from "../ClientFormUI";
import toast from "react-hot-toast";

const ID_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "nationalId", label: "National ID Card" },
  { value: "votersId", label: "Voter's ID Card" },
  { value: "drivingLicense", label: "Driving License" },
  { value: "studentId", label: "Student ID Card" },
  { value: "workId", label: "Work ID Card" },
] as const;

const IdentificationStep: React.FC = () => {
  const {
    control,
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<ClientFormData>();

  const [isUploading, setIsUploading] = useState(false);

  const idType = watch("idDetails.idType");
  const idFile = watch("idDetails.idFile");

  // Helper function to clear field errors
  const clearFieldErrors = useCallback(
    (fieldName: keyof ClientFormData) => {
      clearErrors(fieldName);
    },
    [clearErrors]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type - allow images and PDFs
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("idDetails.idFile", {
          type: "manual",
          message: "Please upload a valid image (JPEG, PNG, WebP) or PDF file",
        });
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("idDetails.idFile", {
          type: "manual",
          message: "File size must be less than 5MB",
        });
        return;
      }

      setIsUploading(true);

      // Clear any previous errors
      clearFieldErrors("idDetails.idFile" as keyof ClientFormData);

      // Use FileReader to convert to base64
      const reader = new FileReader();

      reader.onload = (event) => {
        const url = event.target?.result as string;

        // Set the form data with the base64 URL and filename
        setValue("idDetails.idFile", {
          url,
          fileName: file.name,
        });

        // Trigger validation
        trigger("idDetails.idFile");

        setIsUploading(false);
        toast.success("ID document uploaded successfully!");
      };

      reader.onerror = () => {
        setError("idDetails.idFile", {
          type: "manual",
          message: "Failed to read the file",
        });
        setIsUploading(false);
        toast.error("Failed to upload ID document");
      };

      // Read the file as data URL (base64)
      reader.readAsDataURL(file);
    },
    [setValue, trigger, setError, clearFieldErrors]
  );

  const handleRemoveFile = useCallback(() => {
    setValue("idDetails.idFile", { url: "", fileName: "" });
    clearFieldErrors("idDetails.idFile" as keyof ClientFormData);
  }, [setValue, clearFieldErrors]);

  const inputClasses =
    "transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Identification Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ID Type Selection */}
          <FormField
            control={control}
            name="idDetails.idType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                  ID Type
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ID_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Select the type of identification document
                </FormDescription>
                <FormMessage className="text-red-600 dark:text-red-400 text-sm" />
              </FormItem>
            )}
          />

          {/* ID Number */}
          <FormField
            control={control}
            name="idDetails.idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
                  ID Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={
                      idType === "passport"
                        ? "G1234567"
                        : idType === "nationalId"
                        ? "GHA-123456789-0"
                        : "Enter ID number"
                    }
                    className={inputClasses}
                  />
                </FormControl>
                <FormDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Enter the identification number exactly as shown on the
                  document
                </FormDescription>
                <FormMessage className="text-red-600 dark:text-red-400 text-sm" />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <div className="space-y-4">
            <FormLabel className="text-gray-700 dark:text-gray-200 font-medium">
              ID Document Upload
            </FormLabel>

            {!idFile?.url ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Upload a clear photo or scan of your ID document
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supported formats: JPEG, PNG, WebP, PDF (Max 5MB)
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      className="relative border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-green-800 dark:text-green-200 font-medium text-sm">
                          {idFile.fileName}
                        </p>
                        <p className="text-green-600 dark:text-green-400 text-xs">
                          File uploaded successfully
                        </p>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show form field errors for file upload */}
            {errors.idDetails?.idFile && (
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      {errors.idDetails.idFile.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Summary */}
      {(errors.idDetails?.idType ||
        errors.idDetails?.idNumber ||
        errors.idDetails?.idFile) && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-red-800 dark:text-red-200 font-medium text-sm">
                  Please complete the identification details:
                </h4>
                <ul className="text-red-700 dark:text-red-300 text-sm mt-1 space-y-1">
                  {errors.idDetails?.idType && (
                    <li>• {errors.idDetails.idType.message}</li>
                  )}
                  {errors.idDetails?.idNumber && (
                    <li>• {errors.idDetails.idNumber.message}</li>
                  )}
                  {errors.idDetails?.idFile && (
                    <li>
                      •{" "}
                      {errors.idDetails.idFile.message ||
                        "ID document is required"}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IdentificationStep;
