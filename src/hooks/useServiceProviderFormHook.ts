// src/hooks/useServiceProviderForm.ts

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import { Types } from "mongoose";
import { useProvider } from "./useServiceProvider";
import {
  ProviderContactDetails,
  IdDetails,
  clientLocation,
  ProfilePicture,
  WitnessDetails,
  SocialMediaHandle,
  CreateProviderInput,
  UpdateProviderInput,
} from "@/store/type/client_provider_Data";
// Form field validation errors
export interface FormFieldErrors {
  userId?: string;
  fullName?: string;
  contactDetails?: {
    primaryContact?: string;
    secondaryContact?: string;
    email?: string;
    emergencyContact?: string;
  };
  idDetails?: {
    idType?: string;
    idNumber?: string;
    idFile?: string;
  };
  location?: {
    gpsAddress?: string;
    nearbyLandmark?: string;
    region?: string;
    city?: string;
    district?: string;
    locality?: string;
  };
  profilePicture?: string;
  serviceRendering?: string;
  witnessDetails?:
    | Array<{
        fullName?: string;
        phone?: string;
        idType?: string;
        idNumber?: string;
        relationship?: string;
      }>
    | undefined;

  socialMediaHandles?: Array<{
    nameOfSocial?: string;
    userName?: string;
  }>;
}

// Form data structure matching CreateProviderInput
export interface ServiceProviderFormData {
  userId: string;
  fullName: string;
  contactDetails: ProviderContactDetails;
  idDetails: IdDetails;
  location: clientLocation;
  profilePicture: ProfilePicture;
  serviceRendering: Types.ObjectId[];
  witnessDetails: WitnessDetails[];
  socialMediaHandles: SocialMediaHandle[];
}

// Form configuration options
export interface FormOptions {
  mode: "create" | "update";
  providerId?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

// Hook return interface
export interface UseServiceProviderFormReturn {
  // Form data and state
  formData: ServiceProviderFormData;
  errors: FormFieldErrors;
  isValid: boolean;
  isDirty: boolean;

  // Loading states
  isSubmitting: boolean;
  isValidating: boolean;
  isSaving: boolean;

  // Form actions
  updateField: <K extends keyof ServiceProviderFormData>(
    field: K,
    value: ServiceProviderFormData[K]
  ) => void;
  updateNestedField: <
    K extends keyof ServiceProviderFormData,
    NK extends keyof ServiceProviderFormData[K]
  >(
    field: K,
    nestedField: NK,
    value: ServiceProviderFormData[K][NK]
  ) => void;

  // Array field operations
  addWitness: () => void;
  removeWitness: (index: number) => void;
  updateWitness: (index: number, witness: Partial<WitnessDetails>) => void;

  addSocialMedia: () => void;
  removeSocialMedia: (index: number) => void;
  updateSocialMedia: (
    index: number,
    social: Partial<SocialMediaHandle>
  ) => void;

  addService: (serviceId: Types.ObjectId) => void;
  removeService: (serviceId: Types.ObjectId) => void;

  // Validation
  validateField: (field: keyof ServiceProviderFormData) => boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  clearFieldError: (field: keyof ServiceProviderFormData) => void;

  // Form operations
  submitForm: () => Promise<boolean>;
  saveForm: () => Promise<boolean>;
  resetForm: () => void;
  loadProvider: (providerId: string) => Promise<void>;

  // Utility functions
  getFieldError: (field: keyof ServiceProviderFormData) => string | undefined;
  hasFieldError: (field: keyof ServiceProviderFormData) => boolean;
  getFormProgress: () => number;
}

const initialFormData: ServiceProviderFormData = {
  userId: "",
  fullName: "",
  contactDetails: {
    primaryContact: "",
    secondaryContact: "",
    email: "",
    emergencyContact: "",
  },
  idDetails: {
    idType: "",
    idNumber: "",
    idFile: {
      url: "",
      fileName: "",
    },
  },
  location: {
    gpsAddress: "",
    nearbyLandmark: "",
    region: "",
    city: "",
    district: "",
    locality: "",
  },
  profilePicture: {
    url: "",
    fileName: "",
  },
  serviceRendering: [],
  witnessDetails: [
    {
      fullName: "",
      phone: "",
      idType: "",
      idNumber: "",
      relationship: "",
    },
  ],
  socialMediaHandles: [],
};

const initialErrors: FormFieldErrors = {};

export const useServiceProviderForm = (
  options: FormOptions
): UseServiceProviderFormReturn => {
  const { mode, providerId, autoSave = false, autoSaveDelay = 2000 } = options;
  const { toast } = useToast();
  const { actions, currentProvider, isCreating, isUpdating, error } =
    useProvider();

  // Form state
  const [formData, setFormData] =
    useState<ServiceProviderFormData>(initialFormData);
  const [errors, setErrors] = useState<FormFieldErrors>(initialErrors);
  const [isDirty, setIsDirty] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Computed states
  const isSubmitting = isCreating || isUpdating;
  const isValid = Object.keys(errors).length === 0;

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateField = useCallback(
    (field: keyof ServiceProviderFormData): boolean => {
      const newErrors = { ...errors };

      switch (field) {
        case "userId":
          if (!formData.userId.trim()) {
            newErrors.userId = "User ID is required";
          } else {
            delete newErrors.userId;
          }
          break;

        case "fullName":
          if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
          } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters";
          } else {
            delete newErrors.fullName;
          }
          break;

        case "contactDetails":
          const contactErrors: FormFieldErrors["contactDetails"] = {};

          if (!formData.contactDetails.primaryContact.trim()) {
            contactErrors.primaryContact = "Primary contact is required";
          } else if (!validatePhone(formData.contactDetails.primaryContact)) {
            contactErrors.primaryContact = "Invalid phone number format";
          }

          if (!formData.contactDetails.email.trim()) {
            contactErrors.email = "Email is required";
          } else if (!validateEmail(formData.contactDetails.email)) {
            contactErrors.email = "Invalid email format";
          }

          if (
            formData.contactDetails.secondaryContact &&
            !validatePhone(formData.contactDetails.secondaryContact)
          ) {
            contactErrors.secondaryContact = "Invalid phone number format";
          }

          if (!formData.contactDetails.emergencyContact.trim()) {
            contactErrors.emergencyContact = "Emergency contact is required";
          } else if (!validatePhone(formData.contactDetails.emergencyContact)) {
            contactErrors.emergencyContact = "Invalid phone number format";
          }

          if (Object.keys(contactErrors).length > 0) {
            newErrors.contactDetails = contactErrors;
          } else {
            delete newErrors.contactDetails;
          }
          break;

        case "serviceRendering":
          if (formData.serviceRendering.length === 0) {
            newErrors.serviceRendering =
              "At least one service must be selected";
          } else {
            delete newErrors.serviceRendering;
          }
          break;

        case "witnessDetails":
          const witnessErrors: NonNullable<FormFieldErrors["witnessDetails"]> =
            [];

          formData.witnessDetails.forEach((witness, index) => {
            const witnessError: NonNullable<
              FormFieldErrors["witnessDetails"]
            >[number] = {};

            if (!witness.fullName.trim()) {
              witnessError.fullName = "Witness name is required";
            }

            if (!witness.phone.trim()) {
              witnessError.phone = "Witness phone is required";
            } else if (!validatePhone(witness.phone)) {
              witnessError.phone = "Invalid phone number format";
            }

            if (!witness.idType.trim()) {
              witnessError.idType = "ID type is required";
            }

            if (!witness.idNumber.trim()) {
              witnessError.idNumber = "ID number is required";
            }

            if (!witness.relationship.trim()) {
              witnessError.relationship = "Relationship is required";
            }

            if (Object.keys(witnessError).length > 0) {
              witnessErrors[index] = witnessError;
            }
          });

          if (witnessErrors.length > 0) {
            newErrors.witnessDetails = witnessErrors;
          } else {
            delete newErrors.witnessDetails;
          }
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, errors]
  );

  const validateForm = useCallback((): boolean => {
    setIsValidating(true);

    const fieldsToValidate: (keyof ServiceProviderFormData)[] = [
      "userId",
      "fullName",
      "contactDetails",
      "serviceRendering",
      "witnessDetails",
    ];

    const validationResults = fieldsToValidate.map((field) =>
      validateField(field)
    );
    const isFormValid = validationResults.every((result) => result);

    setIsValidating(false);
    return isFormValid;
  }, [validateField]);

  const saveForm = useCallback(async (): Promise<boolean> => {
    if (mode !== "update" || !providerId) return false;

    try {
      setIsSaving(true);

      const updateData: Partial<UpdateProviderInput> = {
        ...formData,
        socialMediaHandles:
          formData.socialMediaHandles.length > 0
            ? formData.socialMediaHandles
            : undefined,
      };

      await actions.updateProvider(providerId, updateData);

      toast({
        title: "Saved",
        description: "Changes have been saved automatically.",
      });

      setIsDirty(false);
      return true;
    } catch (err) {
      console.error("Auto-save failed:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, mode, providerId, actions, toast]);

  // Field update functions
  const updateField = useCallback(
    <K extends keyof ServiceProviderFormData>(
      field: K,
      value: ServiceProviderFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);

      // Clear field error when user starts typing
      if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }

      // Auto-save functionality
      if (autoSave && mode === "update") {
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }

        const timeout = setTimeout(() => {
          saveForm();
        }, autoSaveDelay);

        setAutoSaveTimeout(timeout);
      }
    },
    [errors, autoSave, mode, autoSaveTimeout, autoSaveDelay, saveForm]
  );

  const updateNestedField = useCallback(
    <
      K extends keyof ServiceProviderFormData,
      NK extends keyof ServiceProviderFormData[K]
    >(
      field: K,
      nestedField: NK,
      value: ServiceProviderFormData[K][NK]
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] as object),
          [nestedField]: value,
        },
      }));
      setIsDirty(true);
    },
    []
  );

  // Array operations
  const addWitness = useCallback(() => {
    const newWitness: WitnessDetails = {
      fullName: "",
      phone: "",
      idType: "",
      idNumber: "",
      relationship: "",
    };

    setFormData((prev) => ({
      ...prev,
      witnessDetails: [...prev.witnessDetails, newWitness],
    }));
    setIsDirty(true);
  }, []);

  const removeWitness = useCallback(
    (index: number) => {
      if (formData.witnessDetails.length <= 1) {
        toast({
          title: "Cannot Remove Witness",
          description: "At least one witness is required.",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        witnessDetails: prev.witnessDetails.filter((_, i) => i !== index),
      }));
      setIsDirty(true);
    },
    [formData.witnessDetails.length, toast]
  );

  const updateWitness = useCallback(
    (index: number, witness: Partial<WitnessDetails>) => {
      setFormData((prev) => ({
        ...prev,
        witnessDetails: prev.witnessDetails.map((w, i) =>
          i === index ? { ...w, ...witness } : w
        ),
      }));
      setIsDirty(true);
    },
    []
  );

  const addSocialMedia = useCallback(() => {
    const newSocial: SocialMediaHandle = {
      nameOfSocial: "",
      userName: "",
    };

    setFormData((prev) => ({
      ...prev,
      socialMediaHandles: [...prev.socialMediaHandles, newSocial],
    }));
    setIsDirty(true);
  }, []);

  const removeSocialMedia = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialMediaHandles: prev.socialMediaHandles.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }, []);

  const updateSocialMedia = useCallback(
    (index: number, social: Partial<SocialMediaHandle>) => {
      setFormData((prev) => ({
        ...prev,
        socialMediaHandles: prev.socialMediaHandles.map((s, i) =>
          i === index ? { ...s, ...social } : s
        ),
      }));
      setIsDirty(true);
    },
    []
  );

  const addService = useCallback(
    (serviceId: Types.ObjectId) => {
      if (!formData.serviceRendering.includes(serviceId)) {
        setFormData((prev) => ({
          ...prev,
          serviceRendering: [...prev.serviceRendering, serviceId],
        }));
        setIsDirty(true);
      }
    },
    [formData.serviceRendering]
  );

  const removeService = useCallback((serviceId: Types.ObjectId) => {
    setFormData((prev) => ({
      ...prev,
      serviceRendering: prev.serviceRendering.filter(
        (id) => !id.equals(serviceId)
      ),
    }));
    setIsDirty(true);
  }, []);

  // Form operations
  const submitForm = useCallback(async (): Promise<boolean> => {
    try {
      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fix the form errors before submitting.",
          variant: "destructive",
        });
        return false;
      }

      if (mode === "create") {
        const createData: CreateProviderInput = {
          ...formData,
          socialMediaHandles:
            formData.socialMediaHandles.length > 0
              ? formData.socialMediaHandles
              : undefined,
        };

        await actions.createProvider(createData);

        toast({
          title: "Success!",
          description: "Service provider has been registered successfully.",
        });

        setIsDirty(false);
        return true;
      } else if (mode === "update" && providerId) {
        const updateData: Partial<UpdateProviderInput> = {
          ...formData,
          socialMediaHandles:
            formData.socialMediaHandles.length > 0
              ? formData.socialMediaHandles
              : undefined,
        };

        await actions.updateProvider(providerId, updateData);

        toast({
          title: "Success!",
          description: "Service provider has been updated successfully.",
        });

        setIsDirty(false);
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  }, [formData, mode, providerId, actions, toast, validateForm]);

  const loadProvider = useCallback(
    async (id: string): Promise<void> => {
      try {
        await actions.getProviderById(id);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load provider data.",
          variant: "destructive",
        });
      }
    },
    [actions, toast]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setIsDirty(false);

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
  }, [autoSaveTimeout]);

  // Utility functions
  const clearErrors = useCallback(() => {
    setErrors(initialErrors);
  }, []);

  const clearFieldError = useCallback(
    (field: keyof ServiceProviderFormData) => {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    },
    [errors]
  );

  const getFieldError = useCallback(
    (field: keyof ServiceProviderFormData): string | undefined => {
      const error = errors[field];
      if (typeof error === "string") return error;
      if (typeof error === "object" && error !== null) {
        return Object.values(error)[0] as string;
      }
      return undefined;
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (field: keyof ServiceProviderFormData): boolean => {
      return field in errors;
    },
    [errors]
  );

  const getFormProgress = useCallback((): number => {
    const requiredFields = [
      "userId",
      "fullName",
      "contactDetails.primaryContact",
      "contactDetails.email",
      "contactDetails.emergencyContact",
      "serviceRendering",
    ];

    let filledFields = 0;

    requiredFields.forEach((field) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const parentValue = formData[
          parent as keyof ServiceProviderFormData
        ] as unknown as Record<string, unknown>;
        if (parentValue && parentValue[child]) {
          filledFields++;
        }
      } else {
        const value = formData[field as keyof ServiceProviderFormData];
        if (Array.isArray(value) ? value.length > 0 : value) {
          filledFields++;
        }
      }
    });

    return Math.round((filledFields / requiredFields.length) * 100);
  }, [formData]);

  // Load provider data when in update mode
  useEffect(() => {
    if (mode === "update" && providerId && !currentProvider) {
      loadProvider(providerId);
    }
  }, [mode, providerId, currentProvider, loadProvider]);

  // Populate form with current provider data
  useEffect(() => {
    if (currentProvider && mode === "update") {
      const providerData: ServiceProviderFormData = {
        userId: currentProvider.userId,
        fullName: currentProvider.fullName,
        contactDetails: currentProvider.contactDetails,
        idDetails: currentProvider.idDetails,
        location: currentProvider.location,
        profilePicture: currentProvider.profilePicture,
        serviceRendering: currentProvider.serviceRendering || [],
        witnessDetails: currentProvider.witnessDetails || [
          initialFormData.witnessDetails[0],
        ],
        socialMediaHandles: currentProvider.socialMediaHandles || [],
      };

      setFormData(providerData);
      setIsDirty(false);
    }
  }, [currentProvider, mode]);

  // Handle errors from the provider hook
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Cleanup auto-save timeout
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  return {
    // Form data and state
    formData,
    errors,
    isValid,
    isDirty,

    // Loading states
    isSubmitting,
    isValidating,
    isSaving,

    // Form actions
    updateField,
    updateNestedField,

    // Array operations
    addWitness,
    removeWitness,
    updateWitness,
    addSocialMedia,
    removeSocialMedia,
    updateSocialMedia,
    addService,
    removeService,

    // Validation
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,

    // Form operations
    submitForm,
    saveForm,
    resetForm,
    loadProvider,

    // Utility functions
    getFieldError,
    hasFieldError,
    getFormProgress,
  };
};
