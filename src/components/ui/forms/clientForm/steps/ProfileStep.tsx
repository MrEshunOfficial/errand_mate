// src/components/forms/ClientForm/steps/ProfileStep.tsx
import React, { useState, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  User,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { ClientFormData } from "../ClientFormUI";
import Image from "next/image";

// Social media platforms
const SOCIAL_MEDIA_PLATFORMS = [
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "twitter", label: "Twitter/X", icon: "🐦" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "youtube", label: "YouTube", icon: "📺" },
  { value: "snapchat", label: "Snapchat", icon: "👻" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "telegram", label: "Telegram", icon: "✈️" },
  { value: "other", label: "Other", icon: "🌐" },
];

interface ProfileStepProps {
  className?: string;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({ className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    setError,
    clearErrors: clearFieldErrors,
  } = useFormContext<ClientFormData>();

  // Watch the profile picture to show preview
  const profilePicture = watch("profilePicture");

  // Social media handles field array
  const {
    fields: socialMediaFields,
    append: appendSocialMedia,
    remove: removeSocialMedia,
  } = useFieldArray({
    control,
    name: "socialMediaHandles",
  });

  // Handle image upload with FileReader (similar to your example)
  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("profilePicture", {
          type: "manual",
          message: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("profilePicture", {
          type: "manual",
          message: "Image size should be less than 5MB",
        });
        return;
      }

      // Additional validation for allowed types
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("profilePicture", {
          type: "manual",
          message: "Please upload a valid image file (JPEG, PNG, or WebP)",
        });
        return;
      }

      setIsUploading(true);

      // Clear any previous errors
      clearFieldErrors("profilePicture");

      // Use FileReader to convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;

        // Set the form data with the base64 URL and filename
        setValue("profilePicture", {
          url,
          fileName: file.name,
        });

        // Trigger validation
        trigger("profilePicture");

        setIsUploading(false);
        toast.success("Profile picture uploaded successfully!");
      };

      reader.onerror = () => {
        setError("profilePicture", {
          type: "manual",
          message: "Failed to read the image file",
        });
        setIsUploading(false);
        toast.error("Failed to upload profile picture");
      };

      // Read the file as data URL (base64)
      reader.readAsDataURL(file);
    },
    [setValue, trigger, setError, clearFieldErrors]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setValue("profilePicture", { url: "", fileName: "" });
    clearFieldErrors("profilePicture");
    toast.success("Profile picture removed");
  };

  const addSocialMediaHandle = () => {
    appendSocialMedia({
      nameOfSocial: "",
      userName: "",
    });
  };

  const removeSocialMediaHandle = (index: number) => {
    removeSocialMedia(index);
    toast.success("Social media handle removed");
  };

  // Get display URL for preview
  const getDisplayUrl = () => {
    if (profilePicture?.url) {
      return profilePicture.url;
    }
    return null;
  };

  const displayUrl = getDisplayUrl();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Picture Section */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile Picture
              </h3>
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            </div>

            <FormField
              control={control}
              name="profilePicture"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Upload Profile Picture
                  </FormLabel>
                  <FormDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Upload a clear, recent photo. Accepted formats: JPEG, PNG,
                    WebP (Max 5MB)
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="profile-picture-upload"
                          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors relative overflow-hidden ${
                            displayUrl
                              ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}>
                          {displayUrl ? (
                            <>
                              <Image
                                src={displayUrl}
                                alt="Profile preview"
                                fill
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                <div className="text-white text-center">
                                  <Upload className="h-8 w-8 mx-auto mb-2" />
                                  <p className="text-sm">Click to change</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {isUploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400 mb-3"></div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Uploading...
                                  </p>
                                </>
                              ) : (
                                <>
                                  <User className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, or WebP (MAX. 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                          <input
                            id="profile-picture-upload"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                        </label>
                      </div>

                      {/* File Info and Actions */}
                      {profilePicture?.fileName && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {profilePicture.fileName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Successfully uploaded
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveProfilePicture}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-lg">🌐</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Social Media Handles
                </h3>
                <Badge variant="outline" className="text-xs">
                  Optional
                </Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialMediaHandle}
                className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Handle</span>
              </Button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add your social media profiles to help clients connect with you.
            </p>

            {socialMediaFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-sm">No social media handles added yet.</p>
                <p className="text-xs">
                  Click &quot;Add Handle&quot; to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {socialMediaFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Social Media Handle #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialMediaHandle(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 -mt-2">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name={`socialMediaHandles.${index}.nameOfSocial`}
                        render={({ field: platformField }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Platform
                            </FormLabel>
                            <Select
                              onValueChange={platformField.onChange}
                              value={platformField.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white dark:bg-gray-900">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                                  <SelectItem
                                    key={platform.value}
                                    value={platform.value}>
                                    <div className="flex items-center space-x-2">
                                      <span>{platform.icon}</span>
                                      <span>{platform.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`socialMediaHandles.${index}.userName`}
                        render={({ field: usernameField }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Username/Handle
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...usernameField}
                                placeholder="@username or profile URL"
                                className="bg-white dark:bg-gray-900"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {errors.profilePicture && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.profilePicture.message ||
              "Please upload a profile picture to continue."}
          </p>
        </div>
      )}
    </div>
  );
};
