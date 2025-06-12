// src/components/forms/ClientForm/steps/ReviewStep.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Camera,
  Globe,
  Edit,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { ClientFormData } from "../ClienForm";
import Image from "next/image";

interface ReviewStepProps {
  className?: string;
  onEditStep?: (stepIndex: number) => void;
}

interface ReviewSectionProps {
  title: string;
  icon: React.ReactNode;
  stepIndex: number;
  onEdit?: (stepIndex: number) => void;
  children: React.ReactNode;
  isComplete?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  icon,
  stepIndex,
  onEdit,
  children,
  isComplete = true,
}) => (
  <Card className="border border-gray-200 dark:border-gray-700">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </CardTitle>
          </div>
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(stepIndex)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
);

export const ReviewStep: React.FC<ReviewStepProps> = ({
  className = "",
  onEditStep,
}) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<ClientFormData>();

  // Watch all form data
  const formData = watch();

  // Helper function to check if a section is complete
  const isSectionComplete = (section: keyof typeof errors) => {
    return !errors[section];
  };

  // Helper function to format phone numbers
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Not provided";
    // Basic formatting - you can enhance this based on your needs
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  // Helper function to get social media platform emoji
  const getSocialMediaEmoji = (platform: string) => {
    const emojiMap: Record<string, string> = {
      facebook: "📘",
      instagram: "📷",
      twitter: "🐦",
      linkedin: "💼",
      tiktok: "🎵",
      youtube: "📺",
      snapchat: "👻",
      whatsapp: "💬",
      telegram: "✈️",
      other: "🌐",
    };
    return emojiMap[platform.toLowerCase()] || "🌐";
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredSections = [
      !errors.fullName && !errors.userId,
      !errors.contactDetails,
      !errors.location,
      !errors.idDetails,
      !errors.profilePicture,
    ];
    const completedSections = requiredSections.filter(Boolean).length;
    return Math.round((completedSections / requiredSections.length) * 100);
  };

  const completionPercentage = calculateCompletion();
  const isFormComplete = completionPercentage === 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Completion Status */}
      <Card
        className={`border-2 ${
          isFormComplete
            ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
            : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isFormComplete ? (
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isFormComplete ? "Ready to Submit" : "Review Required"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isFormComplete
                    ? "All required information has been provided."
                    : "Please complete all required fields before submitting."}
                </p>
              </div>
            </div>
            <Badge
              variant={isFormComplete ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <ReviewSection
        title="Personal Details"
        icon={<User className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        stepIndex={0}
        onEdit={onEditStep}
        isComplete={
          isSectionComplete("userId") && isSectionComplete("fullName")
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.fullName || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                User ID
              </p>
              <p className="text-base text-gray-900 dark:text-white font-mono">
                {formData.userId || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* Contact Details */}
      <ReviewSection
        title="Contact Information"
        icon={<Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        stepIndex={1}
        onEdit={onEditStep}
        isComplete={isSectionComplete("contactDetails")}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Primary Contact
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formatPhoneNumber(
                  formData.contactDetails?.primaryContact || ""
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Secondary Contact
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formatPhoneNumber(
                  formData.contactDetails?.secondaryContact || ""
                )}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Email Address
            </p>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <p className="text-base text-gray-900 dark:text-white">
                {formData.contactDetails?.email || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* Location Details */}
      <ReviewSection
        title="Location Information"
        icon={<MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        stepIndex={2}
        onEdit={onEditStep}
        isComplete={isSectionComplete("location")}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                GPS Address
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.location?.gpsAddress || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Nearby Landmark
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.location?.nearbyLandmark || "Not provided"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Region
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.location?.region || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                City
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.location?.city || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                District
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.location?.district || "Not provided"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Locality
            </p>
            <p className="text-base text-gray-900 dark:text-white">
              {formData.location?.locality || "Not provided"}
            </p>
          </div>
        </div>
      </ReviewSection>

      {/* Identification Details */}
      <ReviewSection
        title="Identification"
        icon={
          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        }
        stepIndex={3}
        onEdit={onEditStep}
        isComplete={isSectionComplete("idDetails")}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ID Type
              </p>
              <p className="text-base text-gray-900 dark:text-white">
                {formData.idDetails?.idType || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ID Number
              </p>
              <p className="text-base text-gray-900 dark:text-white font-mono">
                {formData.idDetails?.idNumber || "Not provided"}
              </p>
            </div>
          </div>
          {formData.idDetails?.idFile?.fileName && (
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ID Document
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formData.idDetails.idFile.fileName}
                </span>
                {formData.idDetails.idFile.url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(formData.idDetails?.idFile?.url, "_blank")
                    }
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 h-auto"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </ReviewSection>

      {/* Profile Picture */}
      <ReviewSection
        title="Profile Picture"
        icon={<Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
        stepIndex={4}
        onEdit={onEditStep}
        isComplete={isSectionComplete("profilePicture")}
      >
        <div className="space-y-3">
          {formData.profilePicture?.url ? (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={formData.profilePicture.url}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  File Name
                </p>
                <p className="text-base text-gray-900 dark:text-white">
                  {formData.profilePicture.fileName}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded">
                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Uploaded successfully
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(formData.profilePicture?.url, "_blank")
                    }
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 h-auto ml-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No profile picture uploaded</p>
            </div>
          )}

          {/* Social Media Handles */}
          {formData.socialMediaHandles &&
            formData.socialMediaHandles.length > 0 && (
              <div className="mt-4">
                <Separator className="my-3" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Social Media Handles
                </p>
                <div className="space-y-2">
                  {formData.socialMediaHandles.map((handle, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span
                        className="text-lg"
                        role="img"
                        aria-label={handle.nameOfSocial}
                      >
                        {getSocialMediaEmoji(handle.nameOfSocial)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {handle.nameOfSocial}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            @{handle.userName}
                          </span>
                        </div>
                      </div>
                      <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </ReviewSection>

      {/* Form Summary */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Form Summary
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Review all information before submitting
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete
              </p>
            </div>
          </div>

          {!isFormComplete && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Incomplete Fields
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    Please complete all required fields before submitting the
                    form.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
