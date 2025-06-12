// components/forms/ClientForm/ClientForm.tsx
import React from "react";
import { ClientFormUI } from "./ClientFormUI";
import { CreateClientInput } from "@/store/type/client_provider_Data";
import { useClientForm } from "@/hooks/useClientFormHook";

interface ClientFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<CreateClientInput>;
  clientId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  showSuccessRedirect?: boolean;
  isOpen?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  mode = "create",
  initialData,
  clientId,
  onSuccess,
  onClose,
  showSuccessRedirect = true,
  isOpen = true,
}) => {
  const {
    // State
    currentStep,
    isSubmitting,
    sessionError,
    completedSteps,

    // Form methods
    methods,
    handleSubmit,

    // Step navigation
    handleNextStep,
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

    // Form state
    isValid,
    errors,

    // Handlers
    handleClose,
  } = useClientForm({
    initialData,
    mode,
    clientId,
    onSuccess,
    onClose,
    showSuccessRedirect,
  });

  return (
    <ClientFormUI
      // Form state
      methods={methods}
      currentStep={currentStep}
      currentStepData={currentStepData}
      currentProgress={currentProgress}
      isLastStep={isLastStep}
      isStepCompleted={isStepCompleted}
      completedSteps={completedSteps}
      // Form validation
      isValid={isValid}
      errors={errors}
      // Submission state
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      // Session state
      session={session}
      status={status}
      sessionUserId={sessionUserId}
      sessionError={sessionError}
      // Handlers
      handleNextStep={handleNextStep}
      canProceedToNext={canProceedToNext}
      handleClose={handleClose}
      // Props
      mode={mode}
      isOpen={isOpen}
      initialData={initialData}
      onSuccess={onSuccess}
      showSuccessRedirect={showSuccessRedirect}
    />
  );
};
