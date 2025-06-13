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
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  MapPin,
  Camera,
  FileText,
  Users,
  Share2,
  Briefcase,
  AlertCircle,
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
    <div className="space-y-6">
      {/* Form Description */}
      <div className="text-center py-4">
        <p className="text-gray-600 max-w-2xl mx-auto">
          {mode === "create"
            ? "Complete all required sections to register a new service provider. Required sections are marked with an asterisk (*)."
            : "Update the service provider information in any of the sections below. Changes are saved automatically."}
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
          {sections.map((section) => {
            const status = getSectionStatus(section.fields);
            const Icon = section.icon;

            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex flex-col items-center space-y-1 p-3 relative">
                <div className="flex items-center space-x-1">
                  <Icon className="h-4 w-4" />
                  {section.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </div>
                <span className="text-xs font-medium">{section.label}</span>

                {/* Status indicator */}
                <div className="absolute -top-1 -right-1">
                  {status === "error" && (
                    <Badge
                      variant="destructive"
                      className="h-2 w-2 p-0 rounded-full">
                      <span className="sr-only">Has errors</span>
                    </Badge>
                  )}
                  {status === "complete" && (
                    <Badge
                      variant="default"
                      className="h-2 w-2 p-0 rounded-full bg-green-500">
                      <span className="sr-only">Complete</span>
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-6">
          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Provide the basic identification and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Phone numbers, email address, and emergency contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Details</span>
                </CardTitle>
                <CardDescription>
                  Address, region, and location information
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          <TabsContent value="identification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Identification Details</span>
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Identity verification documents and information
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Profile Picture</span>
                </CardTitle>
                <CardDescription>
                  Upload a professional profile photo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilePictureSection
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

          {/* Services */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Services Offered</span>
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Select the services this provider can offer
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          <TabsContent value="witnesses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Witness Information</span>
                  <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>
                  Add at least one witness who can verify the provider&apos;s
                  identity
                </CardDescription>
              </CardHeader>
              <CardContent>
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
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>Social Media Handles</span>
                </CardTitle>
                <CardDescription>
                  Add social media profiles (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
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
      </Tabs>

      {/* Form Status Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Form Status</h4>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {sections.map((section) => {
                const status = getSectionStatus(section.fields);
                const Icon = section.icon;

                return (
                  <div key={section.id} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{section.label}</span>
                    {status === "complete" && (
                      <Badge
                        variant="outline"
                        className="text-green-700 border-green-300">
                        ✓
                      </Badge>
                    )}
                    {status === "error" && (
                      <Badge variant="destructive" className="text-xs">
                        !
                      </Badge>
                    )}
                    {section.required && status === "incomplete" && (
                      <Badge
                        variant="outline"
                        className="text-orange-700 border-orange-300">
                        Required
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Summary */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Progress:{" "}
                  {
                    sections.filter(
                      (s) => getSectionStatus(s.fields) === "complete"
                    ).length
                  }{" "}
                  of {sections.length} sections completed
                </span>
                <span className="text-gray-600">
                  Required:{" "}
                  {
                    sections.filter(
                      (s) =>
                        s.required && getSectionStatus(s.fields) !== "complete"
                    ).length
                  }{" "}
                  remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
