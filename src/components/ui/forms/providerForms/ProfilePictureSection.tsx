// src/components/service-provider/ProfilePictureSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, User } from "lucide-react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";

interface ProfilePictureSectionProps {
  formData: ServiceProviderFormData;
  updateNestedField: <
    K extends keyof ServiceProviderFormData,
    NK extends keyof ServiceProviderFormData[K]
  >(
    field: K,
    nestedField: NK,
    value: ServiceProviderFormData[K][NK]
  ) => void;
  errors: FormFieldErrors;
  updateField: <K extends keyof ServiceProviderFormData>(
    field: K,
    value: ServiceProviderFormData[K]
  ) => void;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
}

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  formData,
  updateNestedField,
  validateField,
  getFieldError,
  disabled = false,
}) => {
  const profilePicture = formData.profilePicture || {
    url: "",
    fileName: "",
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // In a real implementation, you would upload the file and get a URL
      const fileUrl = URL.createObjectURL(file);
      updateNestedField("profilePicture", "url", fileUrl);
      updateNestedField("profilePicture", "fileName", file.name);

      // Trigger validation after file change
      setTimeout(() => validateField("profilePicture"), 0);
    }
  };

  const removeProfilePicture = () => {
    updateNestedField("profilePicture", "url", "");
    updateNestedField("profilePicture", "fileName", "");

    // Trigger validation after file removal
    setTimeout(() => validateField("profilePicture"), 0);
  };

  return (
    <div className="space-y-6">
      {/* Current Profile Picture */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-gray-200 dark:border-gray-700">
            <AvatarImage
              src={profilePicture.url}
              alt="Profile picture"
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
              <User className="w-16 h-16 text-gray-400" />
            </AvatarFallback>
          </Avatar>

          {profilePicture.url && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeProfilePicture}
              disabled={disabled}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white border-2 border-white dark:border-gray-900"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {profilePicture.fileName && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {profilePicture.fileName}
            </p>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Profile Picture
        </Label>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Upload a professional photo
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose a clear, well-lit photo where your face is clearly
                visible
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    handleFileUpload(file || null);
                  };
                  input.click();
                }}
                className="h-10 px-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                or drag and drop
              </div>
            </div>
          </div>
        </div>

        {/* File Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>JPG, PNG, GIF</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Max 5MB</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Square aspect ratio recommended</span>
          </div>
        </div>

        {/* Error Message */}
        {getFieldError("profilePicture") && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {getFieldError("profilePicture")}
          </p>
        )}
      </div>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Photo Guidelines
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use a recent photo (taken within the last 6 months)</li>
          <li>• Face should be clearly visible and well-lit</li>
          <li>• No sunglasses, hats, or face coverings</li>
          <li>• Professional or semi-professional appearance preferred</li>
          <li>• Neutral background works best</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePictureSection;
