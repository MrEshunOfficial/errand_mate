// components/forms/ClientForm/ClientFormUI.tsx
import React from "react";
import { FormProvider } from "react-hook-form";
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
  Save,
  X,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Edit,
} from "lucide-react";
import { UseFormReturn, FieldErrors } from "react-hook-form";
import { Session } from "next-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Step components
import ContactDetailsStep from "./steps/ContactDetailsStep";
import IdentificationStep from "./steps/IdentificationStep";
import LocationDetailsStep from "./steps/LocationDetailsStep";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import { ProfileStep } from "./steps/ProfileStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ClientFormData, FORM_STEPS } from "@/hooks/useClientFormHook";
import { CreateClientInput } from "@/store/type/client_provider_Data";
import { Toaster } from "../../toaster";

interface ClientFormUIProps {
  // Form state
  methods: UseFormReturn<ClientFormData>;
  currentStep: number;
  currentStepData: (typeof FORM_STEPS)[number];
  currentProgress: number;
  isLastStep: boolean;
  isStepCompleted: boolean;
  completedSteps: Set<number>;

  // Form validation
  isValid: boolean;
  errors: FieldErrors<ClientFormData>;

  // Submission state
  isSubmitting: boolean;
  handleSubmit: () => void;

  // Session state
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  sessionUserId: string | null;
  sessionError: string | null;

  // Handlers
  handleNextStep: () => Promise<void>;
  handlePrevStep?: () => void;
  canProceedToNext: () => Promise<boolean>;
  handleClose?: () => void;

  // Props
  mode: "create" | "edit";
  isOpen?: boolean;
  initialData?: Partial<CreateClientInput>;
  onSuccess?: () => void;
  showSuccessRedirect?: boolean;
}

// Loading component for consistent loading states
const LoadingState: React.FC<{
  message: string;
  fullPage?: boolean;
}> = ({ message, fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
};

// Error state component
const ErrorState: React.FC<{
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  fullPage?: boolean;
}> = ({ title, message, actionLabel, onAction, onClose, fullPage = false }) => {
  const content = (
    <div className="max-w-md mx-auto text-center">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm mt-1">{message}</p>
            </div>
            <div className="flex justify-center gap-2">
              {actionLabel && onAction && (
                <Button variant="outline" size="sm" onClick={onAction}>
                  {actionLabel}
                </Button>
              )}
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">{content}</div>
        </div>
      </div>
    );
  }

  return <div className="py-8 px-4">{content}</div>;
};

// Step indicator component - Mobile optimized
const StepIndicator: React.FC<{
  steps: typeof FORM_STEPS;
  currentStep: number;
  completedSteps: Set<number>;
}> = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="w-full">
      {/* Mobile view - simplified indicator */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Step {currentStep + 1}</span>
          <span>{steps.length} steps</span>
        </div>
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                completedSteps.has(index)
                  ? "bg-green-500"
                  : index === currentStep
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop view - full indicator */}
      <div className="hidden sm:flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                completedSteps.has(index)
                  ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                  : index === currentStep
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              {completedSteps.has(index) ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-2 transition-colors ${
                  completedSteps.has(index)
                    ? "bg-green-300 dark:bg-green-700"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step content renderer
const renderStepContent = (currentStep: number) => {
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

// Step navigation component - Fixed and mobile optimized
const StepNavigation: React.FC<{
  currentStep: number;
  isLastStep: boolean;
  isFirstStep: boolean;
  isSubmitting: boolean;
  canProceedToNext: () => Promise<boolean>;
  handleNextStep: () => Promise<void>;
  handlePrevStep?: () => void;
  handleSubmit: () => void;
  mode: "create" | "edit";
}> = ({
  currentStep,
  isLastStep,
  isFirstStep,
  isSubmitting,
  canProceedToNext,
  handleNextStep,
  handlePrevStep,
  handleSubmit,
  mode,
}) => {
  const [canProceed, setCanProceed] = React.useState(false);
  const [isCheckingProceed, setIsCheckingProceed] = React.useState(false);

  React.useEffect(() => {
    const checkCanProceed = async () => {
      setIsCheckingProceed(true);
      try {
        const result = await canProceedToNext();
        setCanProceed(result);
      } catch (error) {
        console.error("Error checking if can proceed:", error);
        setCanProceed(false);
      } finally {
        setIsCheckingProceed(false);
      }
    };
    checkCanProceed();
  }, [canProceedToNext, currentStep]);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLastStep && canProceed) {
      await handleNextStep();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (handlePrevStep) {
      handlePrevStep();
    }
  };

  const handleFinalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLastStep && canProceed) {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      {/* Previous Button - Show when not first step AND handlePrevStep is available */}
      {!isFirstStep && handlePrevStep && (
        <Button
          type="button"
          onClick={handlePrev}
          variant="outline"
          disabled={isSubmitting}
          className="flex-1 sm:flex-initial sm:min-w-[120px] border-gray-300 dark:border-gray-600 order-2 sm:order-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
      )}

      {/* Next/Submit Button */}
      <div className="flex-1 order-1 sm:order-2">
        {isLastStep ? (
          <Button
            type="button"
            onClick={handleFinalSubmit}
            disabled={!canProceed || isSubmitting || isCheckingProceed}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === "create" ? "Create Client" : "Update Client"}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || isCheckingProceed}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingProceed ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// Modal wrapper for edit mode - Mobile optimized
const ModalWrapper: React.FC<{
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 w-full max-w-4xl min-h-[90vh] sm:min-h-0 sm:max-h-[90vh] border dark:border-gray-700 overflow-hidden mt-2 sm:mt-0">
        <div className="relative h-full">
          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <div className="p-4 sm:p-6 overflow-y-auto h-full sm:max-h-[90vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Page wrapper for create mode - Mobile optimized
const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
    </div>
  );
};

// Main form content component - Mobile optimized
const FormContent: React.FC<{
  methods: UseFormReturn<ClientFormData>;
  currentStep: number;
  currentStepData: (typeof FORM_STEPS)[number];
  currentProgress: number;
  completedSteps: Set<number>;
  errors: FieldErrors<ClientFormData>;
  isSubmitting: boolean;
  handleSubmit: () => void;
  sessionUserId: string | null;
  sessionError: string | null;
  handleNextStep: () => Promise<void>;
  handlePrevStep?: () => void;
  canProceedToNext: () => Promise<boolean>;
  mode: "create" | "edit";
  isLastStep: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
}> = ({
  methods,
  currentStep,
  currentStepData,
  currentProgress,
  completedSteps,
  errors,
  isSubmitting,
  handleSubmit,
  sessionUserId,
  sessionError,
  handleNextStep,
  handlePrevStep,
  canProceedToNext,
  mode,
  isLastStep,
  status,
}) => {
  const isFirstStep = currentStep === 0;

  // Prevent form submission on Enter key
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Don't automatically submit - let the navigation buttons handle it
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
        {/* Header Section - Mobile optimized */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
              {mode === "create" ? (
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {mode === "create" ? "Create New Client" : "Edit Client"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Progress - Mobile optimized */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep + 1} of {FORM_STEPS.length}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(currentProgress)}%
              </span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>

          {/* Step indicator */}
          <StepIndicator
            steps={FORM_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Step Content - Mobile optimized */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
              {currentStepData.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {renderStepContent(currentStep)}
          </CardContent>
        </Card>

        {/* Status Information - Mobile optimized */}
        {(Object.keys(errors).length > 0 || sessionError) && (
          <div className="flex flex-wrap gap-2">
            {Object.keys(errors).length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {Object.keys(errors).length} error(s)
              </Badge>
            )}
            {sessionError && (
              <Badge variant="destructive" className="text-xs">
                Session Error
              </Badge>
            )}
            {status === "authenticated" && sessionUserId && (
              <Badge variant="outline" className="text-xs">
                Authenticated
              </Badge>
            )}
          </div>
        )}

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep}
          isLastStep={isLastStep}
          isFirstStep={isFirstStep}
          isSubmitting={isSubmitting}
          canProceedToNext={canProceedToNext}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
          handleSubmit={handleSubmit}
          mode={mode}
        />
      </form>
      <Toaster />
    </FormProvider>
  );
};

// Main ClientFormUI component
export const ClientFormUI: React.FC<ClientFormUIProps> = ({
  methods,
  currentStep,
  currentStepData,
  currentProgress,
  isLastStep,
  completedSteps,
  errors,
  isSubmitting,
  handleSubmit,
  status,
  sessionUserId,
  sessionError,
  handleNextStep,
  handlePrevStep,
  canProceedToNext,
  handleClose,
  mode,
  isOpen = true,
}) => {
  // Show loading state while session is loading
  if (status === "loading") {
    const Wrapper = mode === "create" ? PageWrapper : React.Fragment;
    return (
      <Wrapper>
        <LoadingState
          message="Loading session..."
          fullPage={mode === "create"}
        />
      </Wrapper>
    );
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    const Wrapper = mode === "create" ? PageWrapper : React.Fragment;
    return (
      <Wrapper>
        <ErrorState
          title="Authentication Required"
          message="You must be logged in to create or edit clients."
          onClose={handleClose}
          fullPage={mode === "create"}
        />
      </Wrapper>
    );
  }

  // Show session error if there's an issue with the user ID
  if (sessionError && status === "authenticated") {
    const Wrapper = mode === "create" ? PageWrapper : React.Fragment;
    return (
      <Wrapper>
        <ErrorState
          title="Session Error"
          message={`${sessionError}. Please try logging out and logging back in, or contact support if the issue persists.`}
          actionLabel="Refresh Page"
          onAction={() => window.location.reload()}
          onClose={handleClose}
          fullPage={mode === "create"}
        />
      </Wrapper>
    );
  }

  // Prepare form content
  const formContent = (
    <FormContent
      methods={methods}
      currentStep={currentStep}
      currentStepData={currentStepData}
      currentProgress={currentProgress}
      completedSteps={completedSteps}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      sessionUserId={sessionUserId}
      sessionError={sessionError}
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
      canProceedToNext={canProceedToNext}
      mode={mode}
      isLastStep={isLastStep}
      status={status}
    />
  );

  // Render based on mode
  if (mode === "create") {
    // Create mode - full page layout matching the register page
    return <PageWrapper>{formContent}</PageWrapper>;
  } else {
    // Edit mode - modal layout matching the edit page
    return (
      <ModalWrapper isOpen={isOpen} onClose={handleClose}>
        {formContent}
      </ModalWrapper>
    );
  }
};
