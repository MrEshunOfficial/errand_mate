// src/components/admin/services/PricingSection.tsx
"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Percent,
  Plus,
  Trash2,
  CreditCard,
  FileText,
} from "lucide-react";
import { ServiceFormData, AdditionalFee } from "./service-schema";

// import { UseFormReturn } from "react-hook-form";
// import { ServiceFormData } from "@/lib/schemas/service-schema";

export interface PricingSectionProps {
  form: UseFormReturn<ServiceFormData>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ form }) => {
  const [newFee, setNewFee] = useState<AdditionalFee>({
    name: "",
    amount: 0,
    description: "",
  });

  const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
  ];

  const addAdditionalFee = () => {
    if (newFee.name.trim() && newFee.amount > 0) {
      const currentFees = form.getValues("pricing.additionalFees") || [];
      form.setValue("pricing.additionalFees", [...currentFees, { ...newFee }]);
      setNewFee({ name: "", amount: 0, description: "" });
    }
  };

  const removeAdditionalFee = (index: number) => {
    const currentFees = form.getValues("pricing.additionalFees") || [];
    form.setValue(
      "pricing.additionalFees",
      currentFees.filter((_, i) => i !== index)
    );
  };

  const additionalFees = form.watch("pricing.additionalFees") || [];

  return (
    <div className="space-y-8">
      {/* Basic Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="pricing.basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Base Price</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Starting price for this service</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Currency</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Currency for pricing</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing.percentageCharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Percent className="w-4 h-4" />
                <span>Percentage Charge</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.0"
                  min="0"
                  max="100"
                  step="0.1"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Additional percentage (0-100%)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Additional Fees */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Additional Fees</span>
          </h4>
        </div>

        {/* Add New Fee Form */}
        <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Add New Fee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Fee name"
                value={newFee.name}
                onChange={(e) =>
                  setNewFee((prev) => ({ ...prev, name: e.target.value }))
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <Input
                type="number"
                placeholder="Amount"
                min="0"
                step="0.01"
                value={newFee.amount}
                onChange={(e) =>
                  setNewFee((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <Input
                placeholder="Description (optional)"
                value={newFee.description}
                onChange={(e) =>
                  setNewFee((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                onClick={addAdditionalFee}
                disabled={!newFee.name.trim() || newFee.amount <= 0}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Fee
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display Added Fees */}
        {additionalFees.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-muted-foreground">
              Added Fees ({additionalFees.length})
            </h5>
            {additionalFees.map((fee, index) => (
              <Card key={index} className="relative">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="font-medium">
                        {fee.name}
                      </Badge>
                      <span className="font-semibold text-lg">
                        ${fee.amount.toFixed(2)}
                      </span>
                    </div>
                    {fee.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {fee.description}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalFee(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Pricing Notes */}
      <FormField
        control={form.control}
        name="pricing.pricingNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Pricing Notes</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional pricing information or terms"
                className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Additional pricing details, terms, or conditions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
