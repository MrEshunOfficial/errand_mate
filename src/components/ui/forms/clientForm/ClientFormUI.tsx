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

  // Layout props for better integration
  embedded?: boolean;
  className?: string;
  showHeader?: boolean;
  showStepIndicator?: boolean;
}

// Enhanced Loading component
const LoadingState: React.FC<{
  message: string;
  embedded?: boolean;
  className?: string;
}> = ({ message, embedded = false, className = "" }) => {
  if (embedded) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-4">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-200">{message}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Error state component
const ErrorState: React.FC<{
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  embedded?: boolean;
  className?: string;
}> = ({
  title,
  message,
  actionLabel,
  onAction,
  onClose,
  embedded = false,
  className = "",
}) => {
  if (embedded) {
    return (
      <div className={`py-8 ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm mt-1">{message}</p>
              </div>
              <div className="flex gap-2">
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
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <X className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {actionLabel && onAction && (
              <Button variant="outline" onClick={onAction} className="flex-1">
                {actionLabel}
              </Button>
            )}
            {onClose && (
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Step indicator component
const StepIndicator: React.FC<{
  steps: typeof FORM_STEPS;
  currentStep: number;
  completedSteps: Set<number>;
  mode?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}> = ({
  steps,
  currentStep,
  completedSteps,
  mode = "horizontal",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  if (mode === "vertical") {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <div
              className={`${
                sizeClasses[size]
              } rounded-full flex items-center justify-center font-medium transition-colors ${
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
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium ${
                  index === currentStep
                    ? "text-blue-700 dark:text-blue-300"
                    : completedSteps.has(index)
                    ? "text-green-700 dark:text-green-300"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`${
              sizeClasses[size]
            } rounded-full flex items-center justify-center font-medium transition-colors ${
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

// Enhanced Step navigation component
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
  layout?: "stacked" | "inline";
}> = ({
  isLastStep,
  isFirstStep,
  isSubmitting,
  canProceedToNext,
  handleNextStep,
  handlePrevStep,
  handleSubmit,
  mode,
  layout = "inline",
}) => {
  const [canProceed, setCanProceed] = React.useState(false);

  React.useEffect(() => {
    const checkCanProceed = async () => {
      const result = await canProceedToNext();
      setCanProceed(result);
    };
    checkCanProceed();
  }, [canProceedToNext]);

  const buttonClass = layout === "stacked" ? "w-full" : "flex-1";

  const submitButton = (
    <Button
      onClick={handleSubmit}
      disabled={!canProceed || isSubmitting}
      className={`${buttonClass} bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
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
  );

  const nextButton = (
    <Button
      onClick={handleNextStep}
      disabled={!canProceed}
      className={`${buttonClass} bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      Continue
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );

  const prevButton = handlePrevStep && !isFirstStep && (
    <Button
      onClick={handlePrevStep}
      variant="outline"
      className={`${buttonClass} border-gray-300 dark:border-gray-600`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Previous
    </Button>
  );

  if (layout === "stacked") {
    return (
      <div className="space-y-3">
        {isLastStep ? submitButton : nextButton}
        {prevButton}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {prevButton}
      {isLastStep ? submitButton : nextButton}
    </div>
  );
};

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
  embedded = false,
  className = "",
  showHeader = true,
  showStepIndicator = true,
}) => {
  const isFirstStep = currentStep === 0;

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <LoadingState
        message="Loading session..."
        embedded={embedded}
        className={className}
      />
    );
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    return (
      <ErrorState
        title="Authentication Required"
        message="You must be logged in to create or edit clients."
        onClose={handleClose}
        embedded={embedded}
        className={className}
      />
    );
  }

  // Show session error if there's an issue with the user ID
  if (sessionError && status === "authenticated") {
    return (
      <ErrorState
        title="Session Error"
        message={`${sessionError}. Please try logging out and logging back in, or contact support if the issue persists.`}
        actionLabel="Refresh Page"
        onAction={() => window.location.reload()}
        onClose={handleClose}
        embedded={embedded}
        className={className}
      />
    );
  }

  if (!isOpen && !embedded) return null;

  const formContent = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        {showHeader && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {mode === "create" ? "Create New Client" : "Edit Client"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
              {handleClose && !embedded && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Step {currentStep + 1} of {FORM_STEPS.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(currentProgress)}% Complete
                </span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            {/* Step indicator */}
            {showStepIndicator && (
              <StepIndicator
                steps={FORM_STEPS}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            )}
          </div>
        )}

        {/* Step Content */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">
              {currentStepData.title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent(currentStep)}</CardContent>
        </Card>

        {/* Status Information */}
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
          layout={embedded ? "stacked" : "inline"}
        />
      </form>
    </FormProvider>
  );

  // Embedded version for better parent integration
  if (embedded) {
    return <div className={`space-y-6 ${className}`}>{formContent}</div>;
  }

  // Modal version
  return (
    <div className="bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 w-full max-w-4xl max-h-[90vh] border dark:border-gray-700 overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[90vh]">{formContent}</div>
      </div>
    </div>
  );
};
