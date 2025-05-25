// src/lib/schemas/service-schema.ts
import { z } from "zod";

// Additional Fee Schema
export const additionalFeeSchema = z.object({
  name: z.string().min(1, "Fee name is required").max(50, "Fee name too long"),
  amount: z.number().min(0, "Amount must be positive"),
  description: z.string().max(200, "Description too long").optional(),
});

// Pricing Schema
export const pricingSchema = z.object({
  basePrice: z.number().min(0.01, "Base price must be greater than 0"),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"], {
    required_error: "Please select a currency",
  }),
  percentageCharge: z.number().min(0).max(100).optional(),
  additionalFees: z.array(additionalFeeSchema).default([]),
  pricingNotes: z.string().max(500, "Pricing notes too long").optional(),
});

// Main Service Schema - with missing fields added
export const serviceSchema = z.object({
  title: z.string().min(1, "Service title is required").max(100, "Title too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  longDescription: z.string().max(2000, "Long description too long").optional(),
  categoryId: z.string().min(1, "Category ID is required"),
  icon: z.string().url("Icon must be a valid URL").optional().or(z.literal("")),
  pricing: pricingSchema,
  popular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string().min(1).max(30)).max(10, "Too many tags").default([]),
});

// Create and Update schemas for operations
export const createServiceSchema = serviceSchema;

export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().min(1, "Service ID is required"),
});

// Type exports
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type CreateServiceData = z.infer<typeof createServiceSchema>;
export type UpdateServiceData = z.infer<typeof updateServiceSchema>;
export type AdditionalFee = z.infer<typeof additionalFeeSchema>;
export type PricingData = z.infer<typeof pricingSchema>;