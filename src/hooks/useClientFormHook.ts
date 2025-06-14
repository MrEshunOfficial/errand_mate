// hooks/useClientForm.ts
import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useClient } from "@/hooks/useClient";
import { CreateClientInput } from "@/store/type/client_provider_Data";
import { useToast } from "@/components/ui/use-toast";

// Schema definitions
const contactDetailsSchema = z.object({
  primaryContact: z
    .string()
    .min(10, "Primary contact must be at least 10 characters")
    .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
  secondaryContact: z
    .string()
    .min(10, "Secondary contact must be at least 10 characters")
    .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

const idDetailsSchema = z.object({
  idType: z.string().min(1, "ID type is required"),
  idNumber: z.string().min(1, "ID number is required"),
  idFile: z.object({
    url: z.string().url("Invalid file URL"),
    fileName: z.string().min(1, "File name is required"),
  }),
});

const locationSchema = z.object({
  gpsAddress: z.string().min(1, "GPS address is required"),
  nearbyLandmark: z.string().min(1, "Nearby landmark is required"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  locality: z.string().min(1, "Locality is required"),
});

const profilePictureSchema = z.object({
  url: z.string().url("Invalid profile picture URL"),
  fileName: z.string().min(1, "File name is required"),
});

const socialMediaSchema = z.object({
  nameOfSocial: z.string().min(1, "Social media platform is required"),
  userName: z.string().min(1, "Username is required"),
});

const clientFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  contactDetails: contactDetailsSchema,
  idDetails: idDetailsSchema,
  location: locationSchema,
  profilePicture: profilePictureSchema,
  socialMediaHandles: z.array(socialMediaSchema).optional(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

// Form steps configuration
export const FORM_STEPS = [
  {
    id: "personal",
    title: "Personal Details",
    description: "Basic information",
    fields: ["userId", "fullName"] as (keyof ClientFormData)[],
  },
  {
    id: "contact",
    title: "Contact Details",
    description: "Phone and email",
    fields: ["contactDetails"] as (keyof ClientFormData)[],
  },
  {
    id: "location",
    title: "Location",
    description: "Address information",
    fields: ["location"] as (keyof ClientFormData)[],
  },
  {
    id: "identification",
    title: "Identification",
    description: "ID verification",
    fields: ["idDetails"] as (keyof ClientFormData)[],
  },
  {
    id: "profile",
    title: "Profile",
    description: "Picture and social media",
    fields: ["profilePicture"] as (keyof ClientFormData)[],
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm details",
    fields: [] as (keyof ClientFormData)[],
  },
] as const;

// Utility functions
export const getUserIdFromSession = (
  session: Session | null
): string | null => {
  if (session?.user?.id) {
    return session.user.id;
  }

  const sessionWithMongoId = session as typeof session & {
    user: { _id: string };
  };

  if (sessionWithMongoId?.user?._id) {
    return sessionWithMongoId.user._id;
  }

  return null;
};

const isValidUserId = (userId: string): boolean => {
  if (!userId || userId.trim() === "") return false;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) return true;

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (objectIdRegex.test(userId)) return true;

  const generalIdRegex = /^[a-zA-Z0-9_-]{8,}$/;
  return generalIdRegex.test(userId);
};

// Hook interface
interface UseClientFormProps {
  initialData?: Partial<CreateClientInput>;
  mode?: "create" | "edit";
  clientId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  showSuccessRedirect?: boolean;
}

export const useClientForm = ({
  initialData,
  mode = "create",
  clientId,
  onSuccess,
  onClose,
  showSuccessRedirect = true,
}: UseClientFormProps = {}) => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Hooks
  const router = useRouter();
  const { toast } = useToast();
  const { createNewClient, updateExistingClient, closeClientForm } =
    useClient();
  const { data: session, status } = useSession();

  // Memoized values
  const sessionUserId = useMemo(() => getUserIdFromSession(session), [session]);
  const isAuthenticated = status === "authenticated";
  const shouldSetUserId =
    mode === "create" && !initialData?.userId && isAuthenticated;

  const defaultValues = useMemo(
    () => ({
      userId: initialData?.userId || "",
      fullName: initialData?.fullName || "",
      contactDetails: {
        primaryContact: initialData?.contactDetails?.primaryContact || "",
        secondaryContact: initialData?.contactDetails?.secondaryContact || "",
        email: initialData?.contactDetails?.email || "",
      },
      idDetails: {
        idType: initialData?.idDetails?.idType || "",
        idNumber: initialData?.idDetails?.idNumber || "",
        idFile: {
          url: initialData?.idDetails?.idFile?.url || "",
          fileName: initialData?.idDetails?.idFile?.fileName || "",
        },
      },
      location: {
        gpsAddress: initialData?.location?.gpsAddress || "",
        nearbyLandmark: initialData?.location?.nearbyLandmark || "",
        region: initialData?.location?.region || "",
        city: initialData?.location?.city || "",
        district: initialData?.location?.district || "",
        locality: initialData?.location?.locality || "",
      },
      profilePicture: {
        url: initialData?.profilePicture?.url || "",
        fileName: initialData?.profilePicture?.fileName || "",
      },
      socialMediaHandles: initialData?.socialMediaHandles || [],
    }),
    [initialData]
  );

  // Form setup
  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid, errors },
    trigger,
    setValue,
    watch,
  } = methods;

  // Effects
  useEffect(() => {
    if (shouldSetUserId && sessionUserId) {
      console.log("Session data:", {
        user: session?.user,
        status,
        hasId: !!session?.user?.id,
        hasEmail: !!session?.user?.email,
        hasName: !!session?.user?.name,
      });

      if (isValidUserId(sessionUserId)) {
        setValue("userId", sessionUserId);
        setSessionError(null);
        console.log("Successfully set userId from session:", sessionUserId);
      } else {
        const errorMsg = `Invalid user ID format: ${sessionUserId}`;
        console.error(errorMsg);
        setSessionError(errorMsg);
        toast({
          title: "Error",
          description: "Invalid user ID format in session",
          variant: "destructive",
        });
      }
    } else if (shouldSetUserId && !sessionUserId) {
      const errorMsg = "No user ID found in session";
      console.error(errorMsg, {
        sessionUser: session?.user,
        sessionKeys: session?.user ? Object.keys(session.user) : [],
      });
      setSessionError(errorMsg);
      toast({
        title: "Authentication Error",
        description: "User ID not found in session. Please try logging out and back in.",
        variant: "destructive",
      });
    }
  }, [shouldSetUserId, sessionUserId, setValue, session, status, toast]);

  useEffect(() => {
    if (status === "loading") {
      setSessionError(null);
    }
  }, [status]);

  // Step validation
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = FORM_STEPS[currentStep].fields;
    if (fieldsToValidate.length === 0) return true;

    return await trigger(fieldsToValidate);
  }, [currentStep, trigger]);

  // Step navigation
  const handleNextStep = useCallback(async () => {
    const isStepValid = await validateCurrentStep();

    if (isStepValid) {
      // Mark current step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]));

      // Move to next step if not at the end
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before proceeding",
        variant: "destructive",
      });
    }
  }, [currentStep, validateCurrentStep, toast]);

  // FIXED: Remove the problematic step removal logic
  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      // Don't remove steps from completedSteps - let them remain completed
      // This maintains a better UX where users can navigate back and forth
      // without losing their progress or having to re-validate
    }
  }, [currentStep]);

  // IMPROVED: Enhanced canProceedToNext function
  const canProceedToNext = useCallback(async (): Promise<boolean> => {
    // If the current step is already completed, allow proceeding
    if (completedSteps.has(currentStep)) {
      return true;
    }
    
    // If it's the review step (typically the last step before submission), always allow
    if (currentStep === FORM_STEPS.length - 1) {
      return true;
    }
    
    // Otherwise, validate the current step
    return await validateCurrentStep();
  }, [validateCurrentStep, completedSteps, currentStep]);

  // Form submission
  const onSubmit = useCallback(
    async (data: ClientFormData) => {
      if (status !== "authenticated") {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create a client",
          variant: "destructive",
        });
        return;
      }

      const currentSessionUserId = getUserIdFromSession(session);
      if (!currentSessionUserId) {
        toast({
          title: "Authentication Error",
          description: "Unable to verify user identity. Please refresh and try again.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        if (!isValidUserId(data.userId)) {
          throw new Error("Invalid user ID format");
        }

        if (data.userId !== currentSessionUserId) {
          throw new Error("User ID mismatch - please refresh and try again");
        }

        const cleanedData: CreateClientInput = {
          ...data,
          socialMediaHandles:
            data.socialMediaHandles?.filter(
              (handle): handle is NonNullable<typeof handle> =>
                handle !== undefined &&
                handle.nameOfSocial.trim() !== "" &&
                handle.userName.trim() !== ""
            ) || undefined,
        };

        if (
          cleanedData.socialMediaHandles &&
          cleanedData.socialMediaHandles.length === 0
        ) {
          delete cleanedData.socialMediaHandles;
        }

        console.log("Submitting client data for user:", cleanedData.userId);

        let result;
        if (mode === "create") {
          result = await createNewClient(cleanedData);
          toast({
            title: "Success",
            description: "Client created successfully!",
          });
        } else if (mode === "edit" && clientId) {
          result = await updateExistingClient(clientId, cleanedData);
          toast({
            title: "Success",
            description: "Client updated successfully!",
          });
        }

        console.log("Client operation completed successfully:", result);

        // Call onSuccess callback first if provided
        if (onSuccess) {
          onSuccess();
        }

        // Handle redirection and cleanup
        if (showSuccessRedirect) {
          // Small delay to ensure toast is shown before redirect
          setTimeout(() => {
            router.push("/user/dashboard");
          }, 500);
        }

        // Close form if needed
        if (onClose) {
          // Delay closing to allow for redirect
          setTimeout(() => {
            onClose();
          }, showSuccessRedirect ? 1000 : 100);
        } else if (!onSuccess && !showSuccessRedirect) {
          setTimeout(() => {
            closeClientForm();
          }, 100);
        }

      } catch (error) {
        console.error("Form submission error:", error);

        let errorMessage = mode === "create"
          ? "Failed to create client. Please try again."
          : "Failed to update client. Please try again.";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          errorMessage = error.message as string;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      mode,
      createNewClient,
      updateExistingClient,
      clientId,
      onClose,
      closeClientForm,
      session,
      status,
      router,
      onSuccess,
      showSuccessRedirect,
      toast,
    ]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      closeClientForm();
    }
  }, [onClose, closeClientForm]);

  // Computed values
  const currentProgress = ((currentStep + 1) / FORM_STEPS.length) * 100;
  const currentStepData = FORM_STEPS[currentStep];
  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const isStepCompleted = completedSteps.has(currentStep);

  return {
    // State
    currentStep,
    isSubmitting,
    sessionError,
    completedSteps,

    // Form methods
    methods,
    handleSubmit: handleSubmit(onSubmit),

    // Step navigation
    handleNextStep,
    handlePrevStep,
    canProceedToNext,

    // Computed values
    currentProgress,
    currentStepData,
    isLastStep,
    isStepCompleted,

    // Session data
    session,
    status,
    sessionUserId,
    isAuthenticated,

    // Form state
    isValid,
    errors,

    // Handlers
    handleClose,

    // Constants
    FORM_STEPS,

    // Form data watching
    watch,
  };
};