// src/schemas/serviceSchema.ts
import { CreateServiceInput } from "@/store/type/service-categories";
import { z } from "zod";

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

  categoryId: z.string().min(1, "Category selection is required"),

  icon: z.string().optional(),

  // Fix: Use explicit boolean values instead of default()
  popular: z.boolean(),

  isActive: z.boolean(),

  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .max(10, "Maximum 10 tags allowed")
    .optional(),
});

// Type inference for form data
export type CreateServiceFormData = z.infer<typeof createServiceFormSchema>;

// Validation helper functions
export const validateCreateServiceForm = (data: unknown) => {
  return createServiceFormSchema.safeParse(data);
};

// Default values for the form - ensure all required fields have values
export const createServiceFormDefaults: CreateServiceFormData = {
  title: "",
  description: "",
  categoryId: "",
  popular: false,
  isActive: true,
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
  categoryId: z.string().min(1, "Category selection is required"),
  icon: z.string().optional(),
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
  formData: CreateServiceFormData,
): CreateServiceInput => {
  // This ensures the form data matches the CreateServiceInput interface
  const input: CreateServiceInput = {
    title: formData.title,
    description: formData.description,
    categoryId: formData.categoryId,
    icon: formData.icon,
    popular: formData.popular,
    isActive: formData.isActive,
    tags: formData.tags,
  };

  return input;
};

