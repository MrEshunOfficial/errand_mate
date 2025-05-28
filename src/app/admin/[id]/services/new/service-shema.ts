// src/schemas/serviceSchema.ts
import { CreateServiceInput } from "@/store/type/service-categories";
import { z } from "zod";

// Additional fee schema for pricing
const additionalFeeSchema = z.object({
  name: z.string().min(1, "Fee name is required"),
  amount: z.number().min(0, "Amount must be non-negative"),
  description: z.string().optional(),
});

// Service pricing schema
const servicePricingSchema = z.object({
  basePrice: z.number().min(0, "Base price must be non-negative"),
  currency: z
    .string()
    .min(1, "Currency is required")
    .length(3, "Currency must be 3 characters (e.g., USD)"),
  percentageCharge: z.number().min(0).max(100).optional(),
  additionalFees: z.array(additionalFeeSchema).optional(),
  pricingNotes: z.string().optional(),
});

// Main create service form schema
export const createServiceFormSchema = z.object({
  title: z
    .string()
    .min(1, "Service title is required")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  longDescription: z
    .string()
    .max(2000, "Long description must be less than 2000 characters")
    .optional(),

  categoryId: z.string().min(1, "Category selection is required"),

  icon: z.string().optional(),

  pricing: servicePricingSchema,

  popular: z.boolean().default(false),

  isActive: z.boolean().default(true),

  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
});

// Type inference for form data
export type CreateServiceFormData = z.infer<typeof createServiceFormSchema>;

// Schema for additional fee form (for dynamic forms)
export const additionalFeeFormSchema = z.object({
  name: z.string().min(1, "Fee name is required"),
  amount: z.number().min(0, "Amount must be non-negative"),
  description: z.string().optional(),
});

export type AdditionalFeeFormData = z.infer<typeof additionalFeeFormSchema>;

// Validation helper functions
export const validateCreateServiceForm = (data: unknown) => {
  return createServiceFormSchema.safeParse(data);
};

// Default values for the form
export const createServiceFormDefaults: Partial<CreateServiceFormData> = {
  popular: false,
  isActive: true,
  pricing: {
    basePrice: 0,
    currency: "USD",
  },
  tags: [],
};

// Form field validation schemas (for individual field validation)
export const serviceFormFieldSchemas = {
  title: z
    .string()
    .min(1, "Service title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  longDescription: z
    .string()
    .max(2000, "Long description must be less than 2000 characters")
    .optional(),
  categoryId: z.string().min(1, "Category selection is required"),
  icon: z.string().optional(),
  basePrice: z.number().min(0, "Base price must be non-negative"),
  currency: z
    .string()
    .min(1, "Currency is required")
    .length(3, "Currency must be 3 characters"),
  percentageCharge: z.number().min(0).max(100).optional(),
  pricingNotes: z.string().optional(),
  popular: z.boolean(),
  isActive: z.boolean(),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
} as const;

// Update service schema (extends create schema with id)
export const updateServiceFormSchema = createServiceFormSchema
  .partial()
  .extend({
    id: z.string().min(1, "Service ID is required"),
  });

export type UpdateServiceFormData = z.infer<typeof updateServiceFormSchema>;

// Validation for converting form data to API input
export const transformToCreateServiceInput = (
  formData: CreateServiceFormData
) => {
  // This ensures the form data matches the CreateServiceInput interface
  const input: CreateServiceInput = {
    title: formData.title,
    description: formData.description,
    longDescription: formData.longDescription,
    categoryId: formData.categoryId,
    icon: formData.icon,
    pricing: formData.pricing,
    popular: formData.popular,
    isActive: formData.isActive,
    tags: formData.tags,
  };

  return input;
};

// Currency options (you can extend this based on your needs)
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
] as const;

// Ensure schema matches the interface (TypeScript will catch mismatches)
type SchemaMatchesInterface = CreateServiceFormData extends CreateServiceInput
  ? true
  : false;
export const _typeCheck: SchemaMatchesInterface = true;
