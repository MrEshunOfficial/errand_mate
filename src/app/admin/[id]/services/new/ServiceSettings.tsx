// src/components/admin/services/ServiceSettingsSection.tsx
"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Eye,
  EyeOff,
  TrendingUp,
  Settings,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    additionalFees?: Array<{
      name: string;
      amount: number;
      description?: string;
    }>;
    pricingNotes?: string;
  };
  popular: boolean;
  isActive: boolean;
  tags?: string[];
}

interface ServiceSettingsSectionProps {
  form: UseFormReturn<ServiceFormData>;
  isLoading?: boolean;
}

export const ServiceSettingsSection: React.FC<ServiceSettingsSectionProps> = ({
  form,
  isLoading = false,
}) => {
  const isActive = form.watch("isActive");
  const isPopular = form.watch("popular");

  const getVisibilityStatus = () => {
    if (isActive) {
      return {
        status: "Active",
        description: "Service is visible to customers and can be booked",
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        variant: "default" as const,
      };
    } else {
      return {
        status: "Inactive",
        description: "Service is hidden from customers and cannot be booked",
        icon: <XCircle className="h-4 w-4 text-red-600" />,
        variant: "secondary" as const,
      };
    }
  };

  const getPopularityStatus = () => {
    if (isPopular) {
      return {
        status: "Featured",
        description: "Service will be highlighted as popular to customers",
        icon: <Star className="h-4 w-4 text-yellow-600" />,
        variant: "default" as const,
      };
    } else {
      return {
        status: "Standard",
        description: "Service appears normally in listings",
        icon: <Star className="h-4 w-4 text-gray-400" />,
        variant: "outline" as const,
      };
    }
  };

  const visibilityStatus = getVisibilityStatus();
  const popularityStatus = getPopularityStatus();

  return (
    <div className="space-y-8">
      {/* Service Visibility */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Service Visibility</h3>
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium flex items-center gap-2">
                  {isActive ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-600" />
                  )}
                  Active Service
                </FormLabel>
                <FormDescription className="text-sm">
                  When enabled, customers can view and book this service
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Status Display */}
        <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
          {visibilityStatus.icon}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Current Status:</span>
              <Badge variant={visibilityStatus.variant}>
                {visibilityStatus.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {visibilityStatus.description}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Popular Service */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Service Promotion</h3>
        </div>

        <FormField
          control={form.control}
          name="popular"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium flex items-center gap-2">
                  <Star
                    className={`h-4 w-4 ${
                      isPopular
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                  Popular Service
                </FormLabel>
                <FormDescription className="text-sm">
                  Mark this service as popular to feature it prominently
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Popularity Status Display */}
        <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
          {popularityStatus.icon}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Promotion Level:</span>
              <Badge variant={popularityStatus.variant}>
                {popularityStatus.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {popularityStatus.description}
            </p>
          </div>
        </div>

        {isPopular && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Popular services appear at the top of category listings and may
              receive special highlighting in the customer interface.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Separator />

      {/* Settings Summary */}
      <div className="bg-muted/30 rounded-lg p-6 border">
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configuration Summary
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Status:</span>
              <div className="flex items-center gap-2">
                {visibilityStatus.icon}
                <span className="font-medium">{visibilityStatus.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Promotion Level:</span>
              <div className="flex items-center gap-2">
                {popularityStatus.icon}
                <span className="font-medium">{popularityStatus.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Customer Visibility:
              </span>
              <span className="font-medium">
                {isActive ? "Visible" : "Hidden"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Booking Available:</span>
              <span className="font-medium">{isActive ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        {/* Configuration Impact */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Impact Preview:</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {isActive ? (
              <>
                <p>✓ Service appears in category listings</p>
                <p>✓ Customers can view service details</p>
                <p>✓ Booking requests are accepted</p>
                {isPopular && <p>✓ Featured prominently in popular section</p>}
              </>
            ) : (
              <>
                <p>✗ Service hidden from category listings</p>
                <p>✗ Service page not accessible to customers</p>
                <p>✗ No new bookings accepted</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warning for inactive services */}
      {!isActive && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Service is currently inactive.</strong> Customers cannot see
            or book this service. Enable the &quot;Active Service&quot; toggle
            above to make it available.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
