// src/components/admin/services/PricingSection.tsx
"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, DollarSign, Percent } from "lucide-react";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
];

interface AdditionalFee {
  name: string;
  amount: number;
  description?: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  icon: string;
  pricing: {
    basePrice: number;
    currency: string;
    percentageCharge?: number;
    additionalFees?: AdditionalFee[];
    pricingNotes?: string;
  };
  popular: boolean;
  isActive: boolean;
  tags?: string[];
}

interface PricingSectionProps {
  form: UseFormReturn<ServiceFormData>;
  isLoading?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  form,
  isLoading = false,
}) => {
  const watchedValues = form.watch();
  const additionalFees = form.watch("pricing.additionalFees") || [];

  const addAdditionalFee = () => {
    const currentFees = form.getValues("pricing.additionalFees") || [];
    form.setValue("pricing.additionalFees", [
      ...currentFees,
      { name: "", amount: 0, description: "" },
    ]);
  };

  const removeAdditionalFee = (index: number) => {
    const currentFees = form.getValues("pricing.additionalFees") || [];
    const updatedFees = currentFees.filter((_, i) => i !== index);
    form.setValue("pricing.additionalFees", updatedFees);
  };

  const updateAdditionalFee = (
    index: number,
    field: keyof AdditionalFee,
    value: string | number
  ) => {
    const currentFees = form.getValues("pricing.additionalFees") || [];
    const updatedFees = [...currentFees];
    updatedFees[index] = { ...updatedFees[index], [field]: value };
    form.setValue("pricing.additionalFees", updatedFees);
  };

  const calculateTotalEstimate = () => {
    const basePrice = watchedValues.pricing?.basePrice || 0;
    const percentageCharge = watchedValues.pricing?.percentageCharge || 0;
    const additionalFees = watchedValues.pricing?.additionalFees || [];

    const percentageAmount = (basePrice * percentageCharge) / 100;
    const feesTotal = additionalFees.reduce(
      (sum, fee) => sum + (fee.amount || 0),
      0
    );

    return basePrice + percentageAmount + feesTotal;
  };

  return (
    <div className="space-y-8">
      {/* Base Price */}
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="pricing.basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Base Price *
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="h-12 text-base pl-8"
                    disabled={isLoading}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                </div>
              </FormControl>
              <FormDescription>The base cost for this service</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Currency *
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Currency for pricing display</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Percentage Charge */}
      <FormField
        control={form.control}
        name="pricing.percentageCharge"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Percentage Charge (Optional)
            </FormLabel>
            <FormControl>
              <div className="relative max-w-xs">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0.0"
                  className="h-12 text-base pr-8"
                  disabled={isLoading}
                  {...field}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </FormControl>
            <FormDescription>
              Additional percentage added to base price (e.g., tax, commission)
              {typeof field.value === "number" && field.value > 0 && (
                <span className="block mt-1 text-sm font-medium">
                  +{watchedValues.pricing?.currency}{" "}
                  {(
                    (watchedValues.pricing?.basePrice || 0) *
                    (field.value / 100)
                  ).toFixed(2)}
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Additional Fees */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Additional Fees</h3>
            <p className="text-sm text-muted-foreground">
              Add extra charges like service fees, equipment costs, etc.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAdditionalFee}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Fee
          </Button>
        </div>

        {additionalFees.length > 0 && (
          <div className="space-y-4">
            {additionalFees.map((fee, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-muted/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Fee #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalFee(index)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Fee Name *
                    </label>
                    <Input
                      placeholder="e.g., Service fee, Equipment rental"
                      value={fee.name}
                      onChange={(e) =>
                        updateAdditionalFee(index, "name", e.target.value)
                      }
                      disabled={isLoading}
                      className="h-10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Amount *
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={fee.amount || ""}
                        onChange={(e) =>
                          updateAdditionalFee(
                            index,
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        disabled={isLoading}
                        className="h-10 pl-8"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="Brief explanation of this fee"
                    value={fee.description || ""}
                    onChange={(e) =>
                      updateAdditionalFee(index, "description", e.target.value)
                    }
                    disabled={isLoading}
                    className="h-10"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Notes */}
      <FormField
        control={form.control}
        name="pricing.pricingNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Pricing Notes
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional pricing information, terms, or conditions"
                className="min-h-[80px] text-base resize-none"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>Any special pricing terms or conditions</span>
              <span className="text-xs">
                {field.value?.length || 0}/1000 characters
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Pricing Summary */}
      <div className="bg-muted/30 rounded-lg p-6 border">
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Pricing Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span className="font-medium">
              {watchedValues.pricing?.currency}{" "}
              {(watchedValues.pricing?.basePrice || 0).toFixed(2)}
            </span>
          </div>

          {(watchedValues?.pricing?.percentageCharge ?? 0) > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>
                Percentage Charge (
                {watchedValues.pricing?.percentageCharge ?? 0}%):
              </span>
              <span>
                +{watchedValues.pricing?.currency}{" "}
                {(
                  (watchedValues.pricing?.basePrice || 0) *
                  ((watchedValues?.pricing?.percentageCharge ?? 0) / 100)
                ).toFixed(2)}
              </span>
            </div>
          )}

          {additionalFees.length > 0 && (
            <>
              <Separator className="my-2" />
              {additionalFees.map(
                (fee, index) =>
                  fee.name && (
                    <div
                      key={index}
                      className="flex justify-between text-muted-foreground text-xs"
                    >
                      <span>{fee.name}:</span>
                      <span>
                        +{watchedValues.pricing?.currency}{" "}
                        {(fee.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  )
              )}
            </>
          )}

          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>Total Estimate:</span>
            <Badge variant="default" className="text-base px-3 py-1">
              {watchedValues.pricing?.currency}{" "}
              {calculateTotalEstimate().toFixed(2)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
