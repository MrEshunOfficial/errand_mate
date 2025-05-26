// src/components/admin/services/BasicInfoSection.tsx
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Service icon suggestions organized by category
const SERVICE_ICONS = [
  { emoji: "🔧", label: "Repair & Maintenance", category: "tools" },
  { emoji: "🛠️", label: "Tools & Equipment", category: "tools" },
  { emoji: "⚡", label: "Electrical", category: "tools" },
  { emoji: "🔨", label: "Construction", category: "tools" },
  { emoji: "🏠", label: "Home Services", category: "home" },
  { emoji: "🧹", label: "Cleaning", category: "home" },
  { emoji: "🌱", label: "Gardening", category: "home" },
  { emoji: "🏡", label: "Property", category: "home" },
  { emoji: "🚗", label: "Automotive", category: "automotive" },
  { emoji: "🚙", label: "Vehicle Service", category: "automotive" },
  { emoji: "⛽", label: "Fuel & Oil", category: "automotive" },
  { emoji: "🔋", label: "Battery", category: "automotive" },
  { emoji: "💻", label: "Technology", category: "tech" },
  { emoji: "📱", label: "Mobile Services", category: "tech" },
  { emoji: "⌨️", label: "Computer Repair", category: "tech" },
  { emoji: "🖥️", label: "Desktop Services", category: "tech" },
  { emoji: "👔", label: "Professional", category: "business" },
  { emoji: "📊", label: "Analytics", category: "business" },
  { emoji: "💼", label: "Business", category: "business" },
  { emoji: "📈", label: "Growth", category: "business" },
  { emoji: "💄", label: "Beauty", category: "personal" },
  { emoji: "✂️", label: "Hair Services", category: "personal" },
  { emoji: "💅", label: "Nails", category: "personal" },
  { emoji: "🧴", label: "Skincare", category: "personal" },
  { emoji: "🍽️", label: "Food & Dining", category: "food" },
  { emoji: "🍕", label: "Food Delivery", category: "food" },
  { emoji: "☕", label: "Beverages", category: "food" },
  { emoji: "🥗", label: "Healthy Food", category: "food" },
];

const ICON_CATEGORIES = [
  { key: "tools", label: "Tools & Repair" },
  { key: "home", label: "Home Services" },
  { key: "automotive", label: "Automotive" },
  { key: "tech", label: "Technology" },
  { key: "business", label: "Business" },
  { key: "personal", label: "Personal Care" },
  { key: "food", label: "Food & Beverage" },
];

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

interface BasicInfoSectionProps {
  form: UseFormReturn<ServiceFormData>;
  isLoading?: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  isLoading = false,
}) => {
  const watchedValues = form.watch();
  const selectedIcon = form.watch("icon");
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("tools");

  const handleIconSelect = (emoji: string) => {
    form.setValue("icon", selectedIcon === emoji ? "" : emoji);
  };

  const handleTagsChange = (tagsString: string) => {
    const tagArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    form.setValue("tags", tagArray);
  };

  const filteredIcons = SERVICE_ICONS.filter(
    (icon) => icon.category === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Service Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Service Title *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter service title"
                className="h-12 text-base"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Choose a clear, descriptive title that customers will understand
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Short Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Short Description *
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the service"
                className="min-h-[100px] text-base resize-none"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>Concise overview that appears in service listings</span>
              <span className="text-xs">
                {field.value?.length || 0}/500 characters
              </span>
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
            <FormLabel className="text-base font-semibold">
              Detailed Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detailed description of the service (optional)"
                className="min-h-[120px] text-base resize-none"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>Comprehensive details shown on the service page</span>
              <span className="text-xs">
                {field.value?.length || 0}/2000 characters
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Service Icon */}
      <FormField
        control={form.control}
        name="icon"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Service Icon *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter an emoji or choose from below"
                className="h-12 text-base"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Enter a custom emoji or choose from the suggested icons
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Icon Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground font-medium">
            Choose Icon by Category
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {ICON_CATEGORIES.map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              disabled={isLoading}
              className="text-sm"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-8 gap-3">
          {filteredIcons.map(({ emoji, label }) => (
            <Button
              key={emoji}
              type="button"
              variant={selectedIcon === emoji ? "default" : "outline"}
              size="sm"
              className="h-12 w-12 p-0 text-xl hover:scale-105 transition-transform"
              onClick={() => handleIconSelect(emoji)}
              disabled={isLoading}
              title={label}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <FormField
        control={form.control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Tags</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter tags separated by commas"
                className="h-12 text-base"
                disabled={isLoading}
                value={watchedValues.tags?.join(", ") || ""}
                onChange={(e) => handleTagsChange(e.target.value)}
              />
            </FormControl>
            <FormDescription>
              Add relevant tags to help customers find your service (e.g.,
              plumbing, repair, emergency)
            </FormDescription>
            <FormMessage />

            {/* Tag Preview */}
            {watchedValues.tags && watchedValues.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {watchedValues.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};
