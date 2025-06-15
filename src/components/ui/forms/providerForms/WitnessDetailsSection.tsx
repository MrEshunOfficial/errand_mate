// src/components/service-provider/WitnessDetailsSection.tsx
"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  User,
  AlertCircle,
  Phone,
  CreditCard,
  Heart,
} from "lucide-react";
import {
  ServiceProviderFormData,
  FormFieldErrors,
} from "@/hooks/useServiceProviderFormHook";
import { WitnessDetails } from "@/store/type/client_provider_Data";

interface WitnessDetailsSectionProps {
  formData: ServiceProviderFormData;
  errors: FormFieldErrors;
  addWitness: () => void;
  removeWitness: (index: number) => void;
  updateWitness: (index: number, witness: Partial<WitnessDetails>) => void;
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  disabled?: boolean;
}

const ID_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voter_id", label: "Voter ID" },
  { value: "nhis_card", label: "NHIS Card" },
];

const RELATIONSHIP_TYPES = [
  { value: "family", label: "Family Member" },
  { value: "friend", label: "Friend" },
  { value: "colleague", label: "Colleague" },
  { value: "neighbor", label: "Neighbor" },
  { value: "business_partner", label: "Business Partner" },
  { value: "mentor", label: "Mentor" },
  { value: "community_leader", label: "Community Leader" },
  { value: "other", label: "Other" },
];

const WitnessDetailsSection: React.FC<WitnessDetailsSectionProps> = ({
  formData,
  errors,
  addWitness,
  removeWitness,
  updateWitness,
  validateField,
  getFieldError,
  disabled = false,
}) => {
  // Get witness-specific errors
  const witnessErrors = errors.witnessDetails || [];
  const generalWitnessError = getFieldError("witnessDetails");

  const handleWitnessChange = (
    index: number,
    field: keyof WitnessDetails,
    value: string
  ) => {
    updateWitness(index, { [field]: value });

    // Clear field-specific errors when user starts typing
    if (witnessErrors[index]?.[field]) {
      validateField("witnessDetails");
    }
  };

  const handleRemoveWitness = (index: number) => {
    if (formData.witnessDetails.length <= 1) {
      return; // Prevent removing the last witness
    }
    removeWitness(index);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");

    // Format as xxx-xxx-xxxx or similar based on length
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return cleaned;
  };

  const handlePhoneChange = (index: number, value: string) => {
    const formatted = formatPhoneNumber(value);
    handleWitnessChange(index, "phone", formatted);
  };

  return (
    <div className="space-y-6">
      {/* Section Description */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          Add at least one witness who can verify your identity and vouch for
          your character. Witnesses should be people who know you well and can
          be contacted if needed.
        </p>
        <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Important Guidelines:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Choose witnesses who know you personally and professionally
              </li>
              <li>Ensure they are willing to be contacted for verification</li>
              <li>Provide accurate contact information</li>
              <li>At least one witness is required for registration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* General Error Message */}
      {generalWitnessError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generalWitnessError}</AlertDescription>
        </Alert>
      )}

      {/* Witnesses List */}
      <div className="space-y-4">
        {formData.witnessDetails.map((witness, index) => {
          const witnessError = witnessErrors[index] || {};

          return (
            <Card
              key={index}
              className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <span>Witness {index + 1}</span>
                    {index === 0 && (
                      <span className="text-xs text-red-500 dark:text-red-400">
                        *
                      </span>
                    )}
                  </CardTitle>

                  {formData.witnessDetails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveWitness(index)}
                      disabled={disabled}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                {index === 0 && (
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                    Primary witness - This person will be contacted first for
                    verification
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`witness-${index}-name`}
                      className="flex items-center space-x-1"
                    >
                      <User className="h-3 w-3" />
                      <span>Full Name</span>
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </Label>
                    <Input
                      id={`witness-${index}-name`}
                      placeholder="Enter witness full name"
                      value={witness.fullName}
                      onChange={(e) =>
                        handleWitnessChange(index, "fullName", e.target.value)
                      }
                      disabled={disabled}
                      className={
                        witnessError.fullName
                          ? "border-red-500 dark:border-red-400"
                          : ""
                      }
                    />
                    {witnessError.fullName && (
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{witnessError.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`witness-${index}-phone`}
                      className="flex items-center space-x-1"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Phone Number</span>
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </Label>
                    <Input
                      id={`witness-${index}-phone`}
                      type="tel"
                      placeholder="e.g., 233-XX-XXX-XXXX"
                      value={witness.phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      disabled={disabled}
                      className={
                        witnessError.phone
                          ? "border-red-500 dark:border-red-400"
                          : ""
                      }
                    />
                    {witnessError.phone && (
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{witnessError.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* ID Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`witness-${index}-idtype`}
                      className="flex items-center space-x-1"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>ID Type</span>
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </Label>
                    <Select
                      value={witness.idType}
                      onValueChange={(value) =>
                        handleWitnessChange(index, "idType", value)
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger
                        className={
                          witnessError.idType
                            ? "border-red-500 dark:border-red-400"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ID_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {witnessError.idType && (
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{witnessError.idType}</span>
                      </p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`witness-${index}-idnumber`}
                      className="flex items-center space-x-1"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>ID Number</span>
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </Label>
                    <Input
                      id={`witness-${index}-idnumber`}
                      placeholder="Enter ID number"
                      value={witness.idNumber}
                      onChange={(e) =>
                        handleWitnessChange(
                          index,
                          "idNumber",
                          e.target.value.toUpperCase()
                        )
                      }
                      disabled={disabled}
                      className={
                        witnessError.idNumber
                          ? "border-red-500 dark:border-red-400"
                          : ""
                      }
                    />
                    {witnessError.idNumber && (
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{witnessError.idNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Relationship - Full Width */}
                <div className="space-y-2">
                  <Label
                    htmlFor={`witness-${index}-relationship`}
                    className="flex items-center space-x-1"
                  >
                    <Heart className="h-3 w-3" />
                    <span>Relationship to You</span>
                    <span className="text-red-500 dark:text-red-400">*</span>
                  </Label>
                  <Select
                    value={witness.relationship}
                    onValueChange={(value) =>
                      handleWitnessChange(index, "relationship", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={
                        witnessError.relationship
                          ? "border-red-500 dark:border-red-400"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select your relationship with this witness" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_TYPES.map((rel) => (
                        <SelectItem key={rel.value} value={rel.value}>
                          {rel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {witnessError.relationship && (
                    <p className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{witnessError.relationship}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Witness Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={addWitness}
          disabled={disabled || formData.witnessDetails.length >= 5}
          className="flex items-center space-x-2 border-dashed border-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 dark:hover:border-teal-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Another Witness</span>
          {formData.witnessDetails.length >= 5 && (
            <span className="text-xs text-gray-500">(Max 5)</span>
          )}
        </Button>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total Witnesses: {formData.witnessDetails.length}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {formData.witnessDetails.length >= 1 ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Minimum requirement met
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                ⚠ At least 1 witness required
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WitnessDetailsSection;
