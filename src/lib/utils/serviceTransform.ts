// src/utils/serviceTransforms.ts
import { CreateServiceFormData } from "@/app/admin/[id]/services/new/service-shema";
import {
  CreateServiceInput,
  UpdateServiceInput,
} from "@/store/type/service-categories";

/**
 * Transform form data to CreateServiceInput
 */
export const transformToCreateServiceInput = (
  formData: CreateServiceFormData
): Omit<CreateServiceInput, "categoryId"> => {
  return {
    title: formData.title,
    description: formData.description,
    longDescription: formData.longDescription,
    icon: formData.icon,
    isActive: formData.isActive,
    popular: formData.popular,
    pricing: {
      basePrice: formData.pricing?.basePrice ?? 0,
      currency: formData.pricing?.currency ?? "USD",
    },
    tags: formData.tags || [],
  };
};

/**
 * Transform form data to UpdateServiceInput (excluding id)
 */
export const transformToUpdateServiceInput = (
  formData: CreateServiceFormData
): Omit<UpdateServiceInput, "id"> => {
  return {
    title: formData.title,
    description: formData.description,
    longDescription: formData.longDescription,
    icon: formData.icon,
    categoryId: formData.categoryId,
    isActive: formData.isActive,
    popular: formData.popular,
    pricing: formData.pricing
      ? {
          basePrice: formData.pricing.basePrice,
          currency: formData.pricing.currency,
        }
      : undefined,
    tags: formData.tags || [],
  };
};

/**
 * Generic error message extractor
 */
export type UnknownError =
  | string
  | { message?: string; error?: unknown; payload?: unknown }
  | { [key: string]: unknown }
  | unknown;

export const getErrorMessage = (error: UnknownError): string => {
  if (!error) return "Unknown error occurred";

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    // Check for message property
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    // Check for payload property (Redux Toolkit async thunk)
    if ("payload" in error) {
      const payload = (error as { payload: unknown }).payload;
      if (typeof payload === "string") {
        return payload;
      }
      if (
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload
      ) {
        return String((payload as { message: unknown }).message);
      }
    }

    // Check for error property
    if ("error" in error) {
      const err = (error as { error: unknown }).error;
      return typeof err === "string" ? err : JSON.stringify(err);
    }

    // Generic object error
    return "Failed to process request. Please check your input and try again.";
  }

  return JSON.stringify(error);
};
