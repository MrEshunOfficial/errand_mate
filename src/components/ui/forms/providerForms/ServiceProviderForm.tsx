// src/components/service-provider/ServiceProviderForm.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  MapPin,
  Camera,
  FileText,
  Users,
  Share2,
  Briefcase,
} from "lucide-react";

// Import form section components (to be created separately)
import { UseServiceProviderFormReturn } from "@/hooks/useServiceProviderFormHook";
import ContactDetailsSection from "./ContactDetailsSection";
import IdentificationSection from "./IdentificationSection";
import LocationSection from "./LocationSection";
import ProfilePictureSection from "./ProfilePictureSection";
import ServicesSection from "./ServicesSection";
import SocialMediaSection from "./SocialMediaSection";
import WitnessDetailsSection from "./WitnessDetailsSection";
import BasicInformationSection from "./BasicInformationSection";
import { Toaster } from "@/components/ui/toaster";

interface ServiceProviderFormProps extends UseServiceProviderFormReturn {
  mode: "create" | "update";
  isSubmitting: boolean;
  isSaving: boolean;
}

export const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({
  formData,
  errors,
  mode,
  isSubmitting,
  isSaving,
  updateField,
  updateNestedField,
  addWitness,
  removeWitness,
  updateWitness,
  addSocialMedia,
  removeSocialMedia,
  updateSocialMedia,
  addService,
  removeService,
  validateField,
  hasFieldError,
  getFieldError,
}) => {
  // Calculate section completion status
  const getSectionStatus = (sectionFields: string[]) => {
    const hasErrors = sectionFields.some((field) =>
      hasFieldError(field as keyof typeof formData)
    );
    const hasData = sectionFields.some((field) => {
      const value = formData[field as keyof typeof formData];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some((v) => v && v !== "");
      }
      return value && value !== "";
    });

    if (hasErrors) return "error";
    if (hasData) return "complete";
    return "incomplete";
  };

  // Section configuration
  const sections = [
    {
      id: "basic",
      label: "Basic Info",
      icon: User,
      fields: ["userId", "fullName"],
      required: true,
    },
    {
      id: "contact",
      label: "Contact",
      icon: Phone,
      fields: ["contactDetails"],
      required: true,
    },
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      fields: ["location"],
      required: false,
    },
    {
      id: "identification",
      label: "ID Details",
      icon: FileText,
      fields: ["idDetails"],
      required: true,
    },
    {
      id: "profile",
      label: "Profile Picture",
      icon: Camera,
      fields: ["profilePicture"],
      required: false,
    },
    {
      id: "services",
      label: "Services",
      icon: Briefcase,
      fields: ["serviceRendering"],
      required: true,
    },
    {
      id: "witnesses",
      label: "Witnesses",
      icon: Users,
      fields: ["witnessDetails"],
      required: true,
    },
    {
      id: "social",
      label: "Social Media",
      icon: Share2,
      fields: ["socialMediaHandles"],
      required: false,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Form Description */}
      <div className="text-center py-4 px-4 sm:px-6">
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {mode === "create"
            ? "Complete all required sections to register a new service provider. Required sections are marked with an asterisk (*)."
            : "Update the service provider information in any of the sections below. Changes are saved automatically."}
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="basic" className="w-full">
        {/* Mobile Dropdown Style Tabs */}
        <div className="block sm:hidden mb-4">
          <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label} {section.required ? "*" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop/Tablet Tabs */}
        <TabsList className="hidden sm:grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {sections.map((section) => {
            const status = getSectionStatus(section.fields);
            const Icon = section.icon;

            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex flex-col items-center space-y-1 p-2 lg:p-3 relative rounded-md transition-colors duration-200 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700 data-[state=active]:shadow-sm text-gray-600 dark:text-gray-400 data-[state=active]:text-gray-900 data-[state=active]:dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center space-x-1">
                  <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                  {section.required && (
                    <span className="text-red-500 dark:text-red-400 text-xs">
                      *
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium leading-tight text-center">
                  {section.label}
                </span>

                {/* Status indicator */}
                <div className="absolute -top-1 -right-1">
                  {status === "error" && (
                    <div className="h-2 w-2 bg-red-500 dark:bg-red-400 rounded-full">
                      <span className="sr-only">Has errors</span>
                    </div>
                  )}
                  {status === "complete" && (
                    <div className="h-2 w-2 bg-green-500 dark:bg-green-400 rounded-full">
                      <span className="sr-only">Complete</span>
                    </div>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-4 sm:mt-6">
          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4 focus:outline-none">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Basic Information</span>
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Provide the basic identification and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <BasicInformationSection
                  formData={formData}
                  errors={errors}
                  updateField={updateField}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Details */}
          <TabsContent value="contact" className="space-y-4 focus:outline-none">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Contact Information</span>
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Phone numbers, email address, and emergency contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ContactDetailsSection
                  formData={formData}
                  errors={errors}
                  updateNestedField={updateNestedField}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location */}
          <TabsContent
            value="location"
            className="space-y-4 focus:outline-none"
          >
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Location Details</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Address, region, and location information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <LocationSection
                  formData={formData}
                  errors={errors}
                  updateNestedField={updateNestedField}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Identification */}
          <TabsContent
            value="identification"
            className="space-y-4 focus:outline-none"
          >
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>Identification Details</span>
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Identity verification documents and information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <IdentificationSection
                  formData={formData}
                  errors={errors}
                  updateNestedField={updateNestedField}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Picture */}
          <TabsContent value="profile" className="space-y-4 focus:outline-none">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    <span>Profile Picture</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Upload a professional profile photo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ProfilePictureSection
                  formData={formData}
                  errors={errors}
                  updateNestedField={updateNestedField}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                  updateField={updateField}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent
            value="services"
            className="space-y-4 focus:outline-none"
          >
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Services Offered</span>
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Select the services this provider can offer
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ServicesSection
                  formData={formData}
                  errors={errors}
                  addService={addService}
                  removeService={removeService}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Witness Details */}
          <TabsContent
            value="witnesses"
            className="space-y-4 focus:outline-none"
          >
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <span>Witness Information</span>
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Add at least one witness who can verify the provider&apos;s
                  identity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <WitnessDetailsSection
                  formData={formData}
                  errors={errors}
                  addWitness={addWitness}
                  removeWitness={removeWitness}
                  updateWitness={updateWitness}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social" className="space-y-4 focus:outline-none">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    <span>Social Media Handles</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                  Optional social media profiles for verification and contact
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <SocialMediaSection
                  formData={formData}
                  errors={errors}
                  addSocialMedia={addSocialMedia}
                  removeSocialMedia={removeSocialMedia}
                  updateSocialMedia={updateSocialMedia}
                  validateField={validateField}
                  getFieldError={getFieldError}
                  disabled={isSubmitting || isSaving}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>

        {/* Form Status Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Complete
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Has Errors
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Incomplete
                </span>
              </div>
            </div>

            {/* Save Status Indicator */}
            {(isSubmitting || isSaving) && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>{isSubmitting ? "Submitting..." : "Saving..."}</span>
              </div>
            )}
          </div>
        </div>
      </Tabs>
      <Toaster />
    </div>
  );
};

export default ServiceProviderForm;
