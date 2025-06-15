// src/components/service-provider/SocialMediaSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Youtube,
  ExternalLink,
} from "lucide-react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";
import { SocialMediaHandle } from "@/store/type/client_provider_Data";

interface SocialMediaSectionProps {
  addSocialMedia: () => void;
  removeSocialMedia: (index: number) => void;
  // Updated to match the hook's function signature
  updateSocialMedia: (
    index: number,
    social: Partial<SocialMediaHandle>
  ) => void;
  formData: ServiceProviderFormData;
  errors: FormFieldErrors;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  formData,
  addSocialMedia,
  removeSocialMedia,
  updateSocialMedia,
  validateField,
  getFieldError,
  disabled = false,
}) => {
  const socialMediaHandles = formData.socialMediaHandles || [];

  // Helper function to update individual fields
  const updateSocialMediaField = (
    index: number,
    field: keyof SocialMediaHandle,
    value: string
  ) => {
    updateSocialMedia(index, { [field]: value });
  };

  const socialMediaPlatforms = [
    {
      value: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      value: "twitter",
      label: "Twitter/X",
      icon: Twitter,
      color: "text-gray-900 dark:text-gray-100",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
    },
    {
      value: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      value: "youtube",
      label: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      value: "website",
      label: "Website",
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  const getPlatformData = (platform: string) => {
    return (
      socialMediaPlatforms.find((p) => p.value === platform) || {
        icon: Globe,
        color: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
      }
    );
  };

  const getUsernamePlaceholder = (platform: string) => {
    const placeholders: Record<string, string> = {
      facebook: "your.profile.name",
      instagram: "yourusername",
      twitter: "yourhandle",
      linkedin: "your-name",
      youtube: "yourchannel",
      website: "your-domain",
    };
    return placeholders[platform] || "username";
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Add your social media profiles to help clients find and verify your
          business presence. This information is optional but recommended for
          building trust and credibility.
        </p>
      </div>

      {/* Social Media Handles */}
      <div className="space-y-4">
        {socialMediaHandles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-pink-600" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  No social media profiles added yet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add your social profiles to increase trust and visibility
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addSocialMedia}
                disabled={disabled}
                className="h-10 px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Social Media Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {socialMediaHandles.map(
              (handle: SocialMediaHandle, index: number) => {
                const platformData = getPlatformData(handle.nameOfSocial);
                const IconComponent = platformData.icon;
                const isValidUsername =
                  handle.userName && handle.userName.trim() !== "";

                return (
                  <Card
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        {/* Header with Platform Icon and Remove Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-12 h-12 rounded-lg ${platformData.bgColor} flex items-center justify-center`}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${platformData.color}`}
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {socialMediaPlatforms.find(
                                  (p) => p.value === handle.nameOfSocial
                                )?.label || "Social Profile"}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Profile #{index + 1}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              removeSocialMedia(index);
                              validateField("socialMediaHandles");
                            }}
                            disabled={disabled}
                            className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          >
                            <X className="w-4 h-4" />
                            <span className="sr-only">
                              Remove social media profile
                            </span>
                          </Button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Platform Select */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Platform *
                              </Label>
                              <Select
                                value={handle.nameOfSocial || ""}
                                onValueChange={(value) => {
                                  updateSocialMediaField(
                                    index,
                                    "nameOfSocial",
                                    value
                                  );
                                  validateField("socialMediaHandles");
                                }}
                                disabled={disabled}
                              >
                                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  {socialMediaPlatforms.map((platform) => {
                                    const Icon = platform.icon;
                                    return (
                                      <SelectItem
                                        key={platform.value}
                                        value={platform.value}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <Icon
                                            className={`w-4 h-4 ${platform.color}`}
                                          />
                                          <span>{platform.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Username/Handle */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Username/Handle *
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                  @
                                </span>
                                <Input
                                  type="text"
                                  placeholder={getUsernamePlaceholder(
                                    handle.nameOfSocial
                                  )}
                                  value={handle.userName || ""}
                                  onChange={(e) => {
                                    updateSocialMediaField(
                                      index,
                                      "userName",
                                      e.target.value
                                    );
                                    validateField("socialMediaHandles");
                                  }}
                                  disabled={disabled}
                                  className={`h-11 pl-8 border-gray-200 dark:border-gray-700 ${
                                    handle.userName && !isValidUsername
                                      ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20"
                                      : "focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20"
                                  }`}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  {handle.userName && isValidUsername ? (
                                    <ExternalLink className="w-4 h-4 text-green-500" />
                                  ) : handle.userName && !isValidUsername ? (
                                    <X className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <Globe className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              {handle.userName && !isValidUsername && (
                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center space-x-1">
                                  <X className="w-3 h-3" />
                                  <span>
                                    Please enter a valid username/handle
                                  </span>
                                </p>
                              )}
                              {handle.userName && isValidUsername && (
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Valid username format</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Preview Link */}
                          {handle.userName &&
                            isValidUsername &&
                            handle.nameOfSocial && (
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <IconComponent
                                      className={`w-4 h-4 ${platformData.color}`}
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      Profile:
                                    </span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                      @{handle.userName}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      on{" "}
                                      {
                                        socialMediaPlatforms.find(
                                          (p) => p.value === handle.nameOfSocial
                                        )?.label
                                      }
                                    </span>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}

            {/* Add More Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={addSocialMedia}
                disabled={disabled || socialMediaHandles.length >= 6}
                className="h-10 px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Profile
                {socialMediaHandles.length >= 6 && (
                  <span className="ml-2 text-xs text-gray-500">(Max 6)</span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {getFieldError("socialMediaHandles") && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>{getFieldError("socialMediaHandles")}</span>
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          💡 Tips for Social Media Profiles
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Ensure your profiles are public or business accounts</li>
          <li>• Use consistent branding across all platforms</li>
          <li>• Include contact information in your profile bios</li>
          <li>
            • Regular activity shows you&apos;re an active service provider
          </li>
          <li>• Professional photos and content build credibility</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialMediaSection;
