// src/components/forms/ClientForm/ClientForm.tsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useClient } from "@/hooks/useClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Menu,
} from "lucide-react";
import { CreateClientInput } from "@/store/type/client_provider_Data";
import toast from "react-hot-toast";
import ContactDetailsStep from "./steps/ContactDetailsStep";
import IdentificationStep from "./steps/IdentificationStep";
import LocationDetailsStep from "./steps/LocationDetailsStep";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import { ProfileStep } from "./steps/ProfileStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useRouter } from "next/navigation";

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

interface ClientFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialData?: Partial<CreateClientInput>;
  mode?: "create" | "edit";
  clientId?: string;
  onSuccess?: () => void;
  showSuccessRedirect?: boolean;
}

const FORM_STEPS = [
  {
    id: "personal",
    title: "Personal Details",
    description: "Basic information",
    shortTitle: "Personal",
  },
  {
    id: "contact",
    title: "Contact Details",
    description: "Phone and email",
    shortTitle: "Contact",
  },
  {
    id: "location",
    title: "Location",
    description: "Address information",
    shortTitle: "Location",
  },
  {
    id: "identification",
    title: "Identification",
    description: "ID verification",
    shortTitle: "ID",
  },
  {
    id: "profile",
    title: "Profile",
    description: "Picture and social media",
    shortTitle: "Profile",
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm details",
    shortTitle: "Review",
  },
];

// Enhanced utility functions for userId from authenticated session
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

export const ClientForm: React.FC<ClientFormProps> = ({
  isOpen = true,
  onClose,
  initialData,
  mode = "create",
  clientId,
  onSuccess,
  showSuccessRedirect = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [showStepNavigation, setShowStepNavigation] = useState(false);
  const router = useRouter();

  const { createNewClient, updateExistingClient, closeClientForm } =
    useClient();

  const { data: session, status } = useSession();

  // Memoize default values to prevent recreation on each render
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
  } = methods;

  // Memoize session values to prevent useEffect from running unnecessarily
  const sessionUserId = useMemo(() => getUserIdFromSession(session), [session]);
  const isAuthenticated = status === "authenticated";
  const shouldSetUserId =
    mode === "create" && !initialData?.userId && isAuthenticated;

  // Fixed useEffect with stable dependencies
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
        toast.error("Invalid user ID format in session");
      }
    } else if (shouldSetUserId && !sessionUserId) {
      const errorMsg = "No user ID found in session";
      console.error(errorMsg, {
        sessionUser: session?.user,
        sessionKeys: session?.user ? Object.keys(session.user) : [],
      });
      setSessionError(errorMsg);
      toast.error(
        "User ID not found in session. Please try logging out and back in."
      );
    }
  }, [shouldSetUserId, sessionUserId, setValue, session, status]);

  // Clear session error when status changes
  useEffect(() => {
    if (status === "loading") {
      setSessionError(null);
    }
  }, [status]);

  const currentProgress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const stepFields: Record<number, (keyof ClientFormData)[]> = {
      0: ["userId", "fullName"],
      1: ["contactDetails"],
      2: ["location"],
      3: ["idDetails"],
      4: ["profilePicture"],
      5: [],
    };

    const fieldsToValidate = stepFields[currentStep];
    if (fieldsToValidate.length === 0) return true;

    return await trigger(fieldsToValidate);
  }, [currentStep, trigger]);

  const handleNext = useCallback(async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setShowStepNavigation(false); // Close mobile navigation after step change
    } else if (!isStepValid) {
      toast.error("Please complete all required fields before proceeding");
    }
  }, [currentStep, validateCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setShowStepNavigation(false); // Close mobile navigation after step change
    }
  }, [currentStep]);

  const handleStepClick = useCallback(
    async (stepIndex: number) => {
      if (stepIndex <= currentStep) {
        setCurrentStep(stepIndex);
        setShowStepNavigation(false); // Close mobile navigation
      } else {
        const canProceed = await validateCurrentStep();
        if (canProceed) {
          setCurrentStep(stepIndex);
          setShowStepNavigation(false); // Close mobile navigation
        } else {
          toast.error("Please complete the current step before proceeding");
        }
      }
    },
    [currentStep, validateCurrentStep]
  );

  // Fixed onSubmit with better error handling
  const onSubmit = useCallback(
    async (data: ClientFormData) => {
      if (status !== "authenticated") {
        toast.error("You must be logged in to create a client");
        return;
      }

      const currentSessionUserId = getUserIdFromSession(session);
      if (!currentSessionUserId) {
        toast.error(
          "Unable to verify user identity. Please refresh and try again."
        );
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
          toast.success("Client created successfully!");
        } else if (mode === "edit" && clientId) {
          result = await updateExistingClient(clientId, cleanedData);
          toast.success("Client updated successfully!");
        }

        // Wait a brief moment to ensure the success toast is shown
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Handle navigation and form closing
        if (showSuccessRedirect) {
          router.push("/user/dashboard");
        }

        // Close the form if onClose is provided
        if (onClose) {
          onClose();
        } else if (!onSuccess && !showSuccessRedirect) {
          // Only close via closeClientForm if no custom handlers are provided
          closeClientForm();
        }

        console.log("Client operation completed successfully:", result);
      } catch (error) {
        console.error("Form submission error:", error);

        // More specific error handling
        if (error instanceof Error) {
          toast.error(error.message);
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          toast.error(error.message as string);
        } else {
          toast.error(
            mode === "create"
              ? "Failed to create client. Please try again."
              : "Failed to update client. Please try again."
          );
        }
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
    ]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      closeClientForm();
    }
  }, [onClose, closeClientForm]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDetailsStep />;
      case 1:
        return <ContactDetailsStep />;
      case 2:
        return <LocationDetailsStep />;
      case 3:
        return <IdentificationStep />;
      case 4:
        return <ProfileStep />;
      case 5:
        return <ReviewStep />;
      default:
        return <PersonalDetailsStep />;
    }
  };

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 p-6 sm:p-8 border dark:border-gray-700 mx-4 w-full max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
              Loading session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 p-6 sm:p-8 text-center border dark:border-gray-700 mx-4 w-full max-w-md">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <X className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
            You must be logged in to create or edit clients.
          </p>
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  // Show session error if there's an issue with the user ID
  if (sessionError && status === "authenticated") {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 p-6 sm:p-8 text-center border dark:border-gray-700 mx-4 w-full max-w-md">
          <div className="text-amber-600 dark:text-amber-400 mb-4">
            <X className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Session Error
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
            {sessionError}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please try logging out and logging back in, or contact support if
            the issue persists.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Refresh Page
            </Button>
            <Button
              onClick={handleClose}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 w-full max-w-6xl min-h-[calc(100vh-1rem)] sm:min-h-0 sm:max-h-[95vh] my-2 sm:my-4 border dark:border-gray-700 flex flex-col">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                    <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {mode === "create" ? "Create New Client" : "Edit Client"}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                      {FORM_STEPS[currentStep].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Mobile Step Navigation Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStepNavigation(!showStepNavigation)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                    Step {currentStep + 1} of {FORM_STEPS.length}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(currentProgress)}% Complete
                  </span>
                </div>
                <Progress
                  value={currentProgress}
                  className="h-2 bg-gray-200 dark:bg-gray-700"
                />
              </div>

              {/* Desktop Step Navigation */}
              <div className="hidden sm:flex justify-between mt-4 overflow-x-auto">
                {FORM_STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(index)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      index === currentStep
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        : index < currentStep
                        ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          index === currentStep
                            ? "border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {index === currentStep && (
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 scale-50"></div>
                        )}
                      </div>
                    )}
                    <span className="hidden lg:inline">{step.title}</span>
                    <span className="lg:hidden">{step.shortTitle}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Step Navigation Dropdown */}
              {showStepNavigation && (
                <div className="sm:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
                  {FORM_STEPS.map((step, index) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handleStepClick(index)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        index === currentStep
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : index < currentStep
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                            index === currentStep
                              ? "border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {index === currentStep && (
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 scale-50"></div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{step.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {step.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-gray-900">
              <Card className="border-0 shadow-none bg-transparent dark:bg-transparent">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                    {FORM_STEPS[currentStep].title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">
                    {FORM_STEPS[currentStep].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              {/* Error/Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {Object.keys(errors).length > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                  >
                    {Object.keys(errors).length} error(s)
                  </Badge>
                )}
                {sessionError && (
                  <Badge
                    variant="destructive"
                    className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                  >
                    Session Error
                  </Badge>
                )}
                {status === "authenticated" && sessionUserId && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
                  >
                    Authenticated
                  </Badge>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1 sm:flex-none border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 sm:flex-none border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="flex space-x-3">
                  {currentStep < FORM_STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        !isValid && currentStep !== FORM_STEPS.length - 1
                      }
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {mode === "create" ? "Creating..." : "Updating..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {mode === "create"
                            ? "Create Client"
                            : "Update Client"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Form Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Please fix the following errors:
                  </h4>
                  <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>
                          <strong className="capitalize">
                            {field.replace(/([A-Z])/g, " $1").toLowerCase()}:
                          </strong>{" "}
                          {error?.message || "This field has an error"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ClientForm;
