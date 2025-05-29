// src/schemas/serviceSchema.ts
import {
  CreateServiceInput,
  UpdateServiceInput,
} from "@/store/type/service-categories";
import { z } from "zod";

// Image schema for consistent validation
const imageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().min(1, "Image alt text is required"),
});

// Main create service form schema - updated to match CreateServiceInput interface
export const createServiceFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  popular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  serviceImage: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
});

// Type inference for form data
export type CreateServiceFormData = z.infer<typeof createServiceFormSchema>;

// Validation helper functions
export const validateCreateServiceForm = (data: unknown) => {
  return createServiceFormSchema.safeParse(data);
};

// Default values for the form - matching the interface structure
export const createServiceFormDefaults: CreateServiceFormData = {
  title: "",
  description: "",
  categoryId: "",
  serviceImage: undefined,
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

  serviceImage: imageSchema.optional(),

  popular: z.boolean().optional(),
  isActive: z.boolean().optional(),

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
): CreateServiceInput => {
  // Transform form data to match CreateServiceInput interface exactly
  const input: CreateServiceInput = {
    title: formData.title,
    description: formData.description,
    categoryId: formData.categoryId,
    serviceImage: formData.serviceImage,
    popular: formData.popular,
    isActive: formData.isActive,
    tags: formData.tags,
  };

  return input;
};

// Transform function for update operations
export const transformToUpdateServiceInput = (
  formData: UpdateServiceFormData
): UpdateServiceInput => {
  const input: UpdateServiceInput = {
    id: formData.id!,
    title: formData.title,
    description: formData.description,
    categoryId: formData.categoryId,
    serviceImage: formData.serviceImage,
    popular: formData.popular,
    isActive: formData.isActive,
    tags: formData.tags,
  };

  // Remove undefined values to keep the partial update clean
  Object.keys(input).forEach((key) => {
    if (input[key as keyof UpdateServiceInput] === undefined) {
      delete input[key as keyof UpdateServiceInput];
    }
  });

  return input;
};

// Additional validation schemas for API endpoints
export const serviceIdSchema = z.string().min(1, "Service ID is required");

export const serviceFiltersSchema = z.object({
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  popular: z.boolean().optional(),
  search: z.string().optional(),
});

export type ServiceFiltersData = z.infer<typeof serviceFiltersSchema>;

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1, "Page must be at least 1").default(1),
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
});

export type PaginationData = z.infer<typeof paginationSchema>;
