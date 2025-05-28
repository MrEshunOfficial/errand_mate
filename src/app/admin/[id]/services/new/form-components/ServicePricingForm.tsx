// src/components/admin/services/ServicePricingForm.tsx
"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Plus, Trash2, DollarSign, Percent, Info } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  CreateServiceFormData,
  AdditionalFeeFormData,
  CURRENCY_OPTIONS,
} from "../service-shema";

interface ServicePricingFormProps {
  form: UseFormReturn<CreateServiceFormData>;
  onStepComplete?: () => void;
}

const ServicePricingForm: React.FC<ServicePricingFormProps> = ({
  form,
  onStepComplete,
}) => {
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);

  // Watch pricing values for calculations
  const watchedValues = form.watch([
    "pricing.basePrice",
    "pricing.percentageCharge",
    "pricing.additionalFees",
  ]);
  const [basePrice, percentageCharge, additionalFees] = watchedValues;

  // Calculate total estimated price
  const calculateEstimatedTotal = (): number => {
    let total = basePrice || 0;

    // Add percentage charge
    if (percentageCharge && percentageCharge > 0) {
      total += (total * percentageCharge) / 100;
    }

    // Add additional fees
    if (additionalFees && additionalFees.length > 0) {
      const feesTotal = additionalFees.reduce(
        (sum, fee) => sum + (fee.amount || 0),
        0
      );
      total += feesTotal;
    }

    return total;
  };

  // Handle adding new additional fee
  const handleAddFee = () => {
    const currentFees = form.getValues("pricing.additionalFees") || [];
    const newFee: AdditionalFeeFormData = {
      name: "",
      amount: 0,
      description: "",
    };

    form.setValue("pricing.additionalFees", [...currentFees, newFee], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handle removing additional fee
  const handleRemoveFee = (index: number) => {
    const currentFees = form.getValues("pricing.additionalFees") || [];
    const updatedFees = currentFees.filter((_, i) => i !== index);

    form.setValue("pricing.additionalFees", updatedFees, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Check if step is complete
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith("pricing")) {
        const isValid = !form.formState.errors.pricing;
        if (isValid && onStepComplete) {
          onStepComplete();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onStepComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Service Pricing
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set up pricing structure for your service
        </p>
      </div>

      {/* Basic Pricing */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            Basic Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Base Price */}
            <FormField
              control={form.control}
              name="pricing.basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Base Price *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value ?? ""}
                        className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : parseFloat(value) || 0
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-500 dark:text-gray-400">
                    The base price for this service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="pricing.currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Currency *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Advanced Pricing Toggle */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
              className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Percent className="h-4 w-4 mr-2" />
              {showAdvancedPricing ? "Hide" : "Show"} Advanced Pricing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Pricing */}
      {showAdvancedPricing && (
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Percent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Advanced Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Percentage Charge */}
            <FormField
              control={form.control}
              name="pricing.percentageCharge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Percentage Charge (%)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0.0"
                        value={field.value ?? ""}
                        className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === ""
                              ? undefined
                              : parseFloat(value) || undefined
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-500 dark:text-gray-400">
                    Additional percentage to add to the base price
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Fees */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Additional Fees
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add extra fees or charges for this service
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFee}
                  className="border-green-200 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Fee
                </Button>
              </div>

              {/* Additional Fees List */}
              {form.watch("pricing.additionalFees")?.map((_, index) => (
                <Card
                  key={index}
                  className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`pricing.additionalFees.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                                Fee Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  placeholder="e.g., Setup Fee"
                                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`pricing.additionalFees.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                                Amount
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value ?? ""}
                                    className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === ""
                                          ? undefined
                                          : parseFloat(value) || 0
                                      );
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFee(index)}
                        className="mt-6 border-red-200 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`pricing.additionalFees.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel className="text-sm text-gray-700 dark:text-gray-300">
                            Description (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Brief description of this fee"
                              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pricing Notes */}
            <FormField
              control={form.control}
              name="pricing.pricingNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Pricing Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Additional notes about pricing (optional)"
                      className="min-h-[80px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 dark:text-gray-400">
                    Any additional information about the pricing structure
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary */}
      {(basePrice > 0 || (additionalFees && additionalFees.length > 0)) && (
        <Card className="border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
              <Info className="h-5 w-5" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Base Price:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-white dark:bg-gray-700"
                >
                  {form.watch("pricing.currency") || "USD"}{" "}
                  {(basePrice || 0).toFixed(2)}
                </Badge>
              </div>

              {percentageCharge && percentageCharge > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Percentage Charge ({percentageCharge}%):
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-white dark:bg-gray-700"
                  >
                    {form.watch("pricing.currency") || "USD"}{" "}
                    {(((basePrice || 0) * percentageCharge) / 100).toFixed(2)}
                  </Badge>
                </div>
              )}

              {additionalFees && additionalFees.length > 0 && (
                <>
                  {additionalFees.map(
                    (fee, index) =>
                      fee.name &&
                      fee.amount > 0 && (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {fee.name}:
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-white dark:bg-gray-700"
                          >
                            {form.watch("pricing.currency") || "USD"}{" "}
                            {fee.amount.toFixed(2)}
                          </Badge>
                        </div>
                      )
                  )}
                </>
              )}

              <div className="pt-2 border-t border-blue-200 dark:border-blue-600">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-blue-900 dark:text-blue-100">
                    Estimated Total:
                  </span>
                  <Badge className="bg-blue-600 dark:bg-blue-500 text-white">
                    {form.watch("pricing.currency") || "USD"}{" "}
                    {calculateEstimatedTotal().toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicePricingForm;
