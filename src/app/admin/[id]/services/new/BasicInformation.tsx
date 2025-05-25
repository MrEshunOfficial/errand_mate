// src/components/admin/services/BasicInfoSection.tsx
"use client";

import React from "react";
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
import { FileText, Hash, Type } from "lucide-react";
import { ServiceFormData } from "./service-schema";

export interface BasicInfoSectionProps {
  form: UseFormReturn<ServiceFormData>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Title and Icon Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Type className="w-4 h-4" />
                <span>Service Title</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter service title"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A clear, descriptive name for your service
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Icon</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Icon name or URL (optional)"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Icon identifier or URL for visual representation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Short Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Short Description</span>
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter a brief description of the service"
                className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A concise overview of your service (max 500 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Long Description */}
      <FormField
        control={form.control}
        name="longDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Detailed Description</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter detailed description of the service (optional)"
                className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Comprehensive details about your service offering (max 2000
              characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
