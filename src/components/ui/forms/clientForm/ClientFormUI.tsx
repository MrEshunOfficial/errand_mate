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
import { UserPlus, CheckCircle, Save, X, ArrowRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Session } from "next-auth";

// Step components
import ContactDetailsStep from "./steps/ContactDetailsStep";
import IdentificationStep from "./steps/IdentificationStep";
import LocationDetailsStep from "./steps/LocationDetailsStep";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import { ProfileStep } from "./steps/ProfileStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ClientFormData, FORM_STEPS } from "@/hooks/useClientFormHook";

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
  errors: any;

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
  canProceedToNext: () => Promise<boolean>;
  handleClose: () => void;

  // Props
  mode: "create" | "edit";
  isOpen: boolean;
}

// Loading component
const LoadingState: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4">
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 p-6 sm:p-8 border dark:border-gray-700 mx-4 w-full max-w-sm">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
          {message}
        </span>
      </div>
    </div>
  </div>
);

// Error state component
const ErrorState: React.FC<{
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}> = ({ title, message, actionLabel, onAction, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4">
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 p-6 sm:p-8 text-center border dark:border-gray-700 mx-4 w-full max-w-md">
      <div className="text-red-600 dark:text-red-400 mb-4">
        <X className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
            {actionLabel}
          </Button>
        )}
        <Button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
          Close
        </Button>
      </div>
    </div>
  </div>
);

// Step indicator component
const StepIndicator: React.FC<{
  steps: typeof FORM_STEPS;
  currentStep: number;
  completedSteps: Set<number>;
}> = ({ steps, currentStep, completedSteps }) => (
  <div className="flex items-center justify-center space-x-2 mb-6">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            completedSteps.has(index)
              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              : index === currentStep
              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}>
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

// Step completion button
const StepCompletionButton: React.FC<{
  isLastStep: boolean;
  isSubmitting: boolean;
  isStepCompleted: boolean;
  canProceedToNext: () => Promise<boolean>;
  handleNextStep: () => Promise<void>;
  handleSubmit: () => void;
  mode: "create" | "edit";
}> = ({
  isLastStep,
  isSubmitting,
  canProceedToNext,
  handleNextStep,
  handleSubmit,
  mode,
}) => {
  const [canProceed, setCanProceed] = React.useState(false);

  React.useEffect(() => {
    const checkCanProceed = async () => {
      const result = await canProceedToNext();
      setCanProceed(result);
    };
    checkCanProceed();
  }, [canProceedToNext]);

  if (isLastStep) {
    return (
      <Button
        onClick={handleSubmit}
        disabled={!canProceed || isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed">
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
  }

  return (
    <Button
      onClick={handleNextStep}
      disabled={!canProceed}
      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed">
      Continue
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );
};

export const ClientFormUI: React.FC<ClientFormUIProps> = ({
  methods,
  currentStep,
  currentStepData,
  currentProgress,
  isLastStep,
  isStepCompleted,
  completedSteps,
  errors,
  isSubmitting,
  handleSubmit,
  status,
  sessionUserId,
  sessionError,
  handleNextStep,
  canProceedToNext,
  handleClose,
  mode,
  isOpen,
}) => {
  // Show loading state while session is loading
  if (status === "loading") {
    return <LoadingState message="Loading session..." />;
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    return (
      <ErrorState
        title="Authentication Required"
        message="You must be logged in to create or edit clients."
        onClose={handleClose}
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
      />
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:shadow-gray-800/50 w-full max-w-2xl max-h-[90vh] border dark:border-gray-700 flex flex-col">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {mode === "create" ? "Create New Client" : "Edit Client"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Step {currentStep + 1} of {FORM_STEPS.length}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(currentProgress)}% Complete
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

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentStepData.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {currentStepData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  {renderStepContent(currentStep)}
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
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

              {/* Step completion button */}
              <StepCompletionButton
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
                isStepCompleted={isStepCompleted}
                canProceedToNext={canProceedToNext}
                handleNextStep={handleNextStep}
                handleSubmit={handleSubmit}
                mode={mode}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
