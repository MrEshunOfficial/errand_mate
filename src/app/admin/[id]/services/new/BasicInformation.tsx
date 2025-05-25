// src/components/admin/services/BasicInformation.tsx
import React from "react";
import { Field, ErrorMessage, FormikErrors, FormikTouched } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ServiceFormData {
  title: string;
  description: string;
  longDescription: string;
  categoryId: string;
  icon: string;
  pricing: {
    basePrice: number;
    currency: "USD" | "EUR" | "GBP";
    percentageCharge: number;
    additionalFees: any[];
    pricingNotes: string;
  };
  popular: boolean;
  isActive: boolean;
  tags: string[];
}

interface BasicInfoSectionProps {
  values: ServiceFormData;
  setFieldValue: (field: string, value: any) => void;
  errors: FormikErrors<ServiceFormData>;
  touched: FormikTouched<ServiceFormData>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  return (
    <div className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title">Service Title *</Label>
        <Field name="title">
          {({ field }: any) => (
            <Input
              {...field}
              id="title"
              placeholder="Enter service title"
              className={
                errors.title && touched.title
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
          )}
        </Field>
        <ErrorMessage name="title">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Field name="description">
          {({ field }: any) => (
            <Textarea
              {...field}
              id="description"
              placeholder="Brief description of the service"
              rows={3}
              className={
                errors.description && touched.description
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
          )}
        </Field>
        <ErrorMessage name="description">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
      </div>

      {/* Long Description Field */}
      <div className="space-y-2">
        <Label htmlFor="longDescription">Detailed Description</Label>
        <Field name="longDescription">
          {({ field }: any) => (
            <Textarea
              {...field}
              id="longDescription"
              placeholder="Detailed description of the service (optional)"
              rows={5}
              className={
                errors.longDescription && touched.longDescription
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
          )}
        </Field>
        <ErrorMessage name="longDescription">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
      </div>

      {/* Icon Field */}
      <div className="space-y-2">
        <Label htmlFor="icon">Service Icon *</Label>
        <Field name="icon">
          {({ field }: any) => (
            <Input
              {...field}
              id="icon"
              placeholder="Icon name (e.g., 'wrench', 'car', 'home')"
              className={
                errors.icon && touched.icon
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
          )}
        </Field>
        <ErrorMessage name="icon">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
        <div className="text-sm text-muted-foreground">
          Choose an icon name from your icon library
        </div>
      </div>

      {/* Tags Field */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Field name="tags">
          {({ field }: any) => (
            <Input
              {...field}
              id="tags"
              value={values.tags.join(", ")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const tagString = e.target.value;
                const tagArray = tagString
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                setFieldValue("tags", tagArray);
              }}
              placeholder="Enter tags separated by commas"
            />
          )}
        </Field>
        <ErrorMessage name="tags">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
        <div className="text-sm text-muted-foreground">
          Separate tags with commas (e.g., plumbing, repair, emergency)
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// PricingSection Component
// ===================================================================

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface AdditionalFee {
  name: string;
  amount: number;
  type: "fixed" | "percentage";
}

interface PricingSectionProps {
  values: ServiceFormData;
  setFieldValue: (field: string, value: any) => void;
  errors: FormikErrors<ServiceFormData>;
  touched: FormikTouched<ServiceFormData>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  const addAdditionalFee = () => {
    const newFee: AdditionalFee = {
      name: "",
      amount: 0,
      type: "fixed",
    };
    setFieldValue("pricing.additionalFees", [
      ...values.pricing.additionalFees,
      newFee,
    ]);
  };

  const removeAdditionalFee = (index: number) => {
    const updatedFees = values.pricing.additionalFees.filter(
      (_, i) => i !== index
    );
    setFieldValue("pricing.additionalFees", updatedFees);
  };

  const updateAdditionalFee = (
    index: number,
    field: keyof AdditionalFee,
    value: string | number
  ) => {
    const updatedFees = [...values.pricing.additionalFees];
    updatedFees[index] = {
      ...updatedFees[index],
      [field]: value,
    };
    setFieldValue("pricing.additionalFees", updatedFees);
  };

  return (
    <div className="space-y-6">
      {/* Base Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price *</Label>
          <Field name="pricing.basePrice">
            {({ field }: any) => (
              <Input
                {...field}
                id="basePrice"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFieldValue("pricing.basePrice", value);
                }}
                className={
                  errors.pricing?.basePrice && touched.pricing?.basePrice
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
            )}
          </Field>
          <ErrorMessage name="pricing.basePrice">
            {(msg) => <div className="text-sm text-red-500">{msg}</div>}
          </ErrorMessage>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <Select
            value={values.pricing.currency}
            onValueChange={(value) => setFieldValue("pricing.currency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage name="pricing.currency">
            {(msg) => <div className="text-sm text-red-500">{msg}</div>}
          </ErrorMessage>
        </div>
      </div>

      {/* Percentage Charge */}
      <div className="space-y-2">
        <Label htmlFor="percentageCharge">Platform Fee (%)</Label>
        <Field name="pricing.percentageCharge">
          {({ field }: any) => (
            <Input
              {...field}
              id="percentageCharge"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="0.0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseFloat(e.target.value) || 0;
                setFieldValue("pricing.percentageCharge", value);
              }}
              className={
                errors.pricing?.percentageCharge &&
                touched.pricing?.percentageCharge
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }
            />
          )}
        </Field>
        <ErrorMessage name="pricing.percentageCharge">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
        <div className="text-sm text-muted-foreground">
          Platform fee percentage (0-100%)
        </div>
      </div>

      {/* Additional Fees */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Additional Fees</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAdditionalFee}>
            <Plus className="w-4 h-4 mr-2" />
            Add Fee
          </Button>
        </div>

        {values.pricing.additionalFees.map((fee, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Fee #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAdditionalFee(index)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Fee Name</Label>
                <Input
                  value={fee.name}
                  onChange={(e) =>
                    updateAdditionalFee(index, "name", e.target.value)
                  }
                  placeholder="e.g., Service Fee"
                />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fee.amount}
                  onChange={(e) =>
                    updateAdditionalFee(
                      index,
                      "amount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={fee.type}
                  onValueChange={(value) =>
                    updateAdditionalFee(index, "type", value)
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Notes */}
      <div className="space-y-2">
        <Label htmlFor="pricingNotes">Pricing Notes</Label>
        <Field name="pricing.pricingNotes">
          {({ field }: any) => (
            <Textarea
              {...field}
              id="pricingNotes"
              placeholder="Additional pricing information or terms"
              rows={3}
            />
          )}
        </Field>
        <ErrorMessage name="pricing.pricingNotes">
          {(msg) => <div className="text-sm text-red-500">{msg}</div>}
        </ErrorMessage>
      </div>
    </div>
  );
};
