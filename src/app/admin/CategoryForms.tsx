"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderPlus, Save, X, PlusCircle, List } from "lucide-react";

// Types
interface Subcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  subcategories: Subcategory[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Form Props Types
interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: Category;
  onSubmit: (data: {
    name: string;
    description?: string;
    icon?: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface SubcategoryFormProps {
  mode: "create" | "edit";
  initialData?: { name: string; description?: string };
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Category Form Component
export const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <CardHeader className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FolderPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                {mode === "create" ? "Create Category" : "Edit Category"}
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                {mode === "create"
                  ? "Build a new category to organize your services efficiently"
                  : "Update and refine your category details"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields Container */}
            <div className="space-y-6">
              {/* Category Name Field */}
              <div className="group">
                <Label
                  htmlFor="category-name"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                  Category Name
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="category-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter a descriptive category name"
                    className="h-14 text-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* Description Field */}
              <div className="group">
                <Label
                  htmlFor="category-description"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                  Description
                  <span className="text-slate-400 ml-1 text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="category-description"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Add a brief description to help identify this category"
                  className="h-14 text-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400"
                />
              </div>

              {/* Icon Field */}
              <div className="group">
                <Label
                  htmlFor="category-icon"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                  Icon
                  <span className="text-slate-400 ml-1 text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="category-icon"
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                  placeholder="🏷️ Add an emoji or icon name"
                  className="h-14 text-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-1 sm:flex-none">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="mr-3 h-5 w-5" />
                    {mode === "create" ? "Create Category" : "Save Changes"}
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="h-14 px-8 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex-1 sm:flex-none">
                <X className="mr-3 h-5 w-5" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Subcategory Form Component
export const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50">
      <CardHeader className="relative overflow-hidden pb-6">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 dark:from-emerald-400/10 dark:via-blue-400/10 dark:to-purple-400/10"></div>

        <div className="relative flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <List className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {mode === "create" ? "Add New Service" : "Edit Service"}
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {mode === "create"
                ? "Create a new service entry"
                : "Update service information"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-5">
            {/* Service Name Field */}
            <div className="group">
              <Label
                htmlFor="subcategory-name"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                Service Name
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="subcategory-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter service name"
                className="h-12 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-4 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Description Field */}
            <div className="group">
              <Label
                htmlFor="subcategory-description"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                Description
                <span className="text-slate-400 ml-1 text-xs">(Optional)</span>
              </Label>
              <Input
                id="subcategory-description"
                type="text"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the service"
                className="h-12 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-4 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="h-12 px-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 transition-all duration-200 flex-1 sm:flex-none">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  {mode === "create" ? (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {mode === "create" ? "Add Service" : "Update Service"}
                </div>
              )}
            </Button>

            {mode === "edit" && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="h-12 px-6 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex-1 sm:flex-none">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Combined Forms Component (for convenience)
interface CategoryFormSectionProps {
  // Category form props
  showCategoryForm: boolean;
  categoryFormMode: "create" | "edit";
  categoryInitialData?: Category;
  onCategorySubmit: (data: {
    name: string;
    description?: string;
    icon?: string;
  }) => void;
  onCategoryCancel: () => void;
  categoryLoading?: boolean;

  // Subcategory form props
  showSubcategoryForm: boolean;
  subcategoryFormMode: "create" | "edit";
  subcategoryInitialData?: { name: string; description?: string };
  onSubcategorySubmit: (data: { name: string; description?: string }) => void;
  onSubcategoryCancel: () => void;
  subcategoryLoading?: boolean;
}

export const CategoryFormSection: React.FC<CategoryFormSectionProps> = ({
  showCategoryForm,
  categoryFormMode,
  categoryInitialData,
  onCategorySubmit,
  onCategoryCancel,
  categoryLoading,
  showSubcategoryForm,
  subcategoryFormMode,
  subcategoryInitialData,
  onSubcategorySubmit,
  onSubcategoryCancel,
  subcategoryLoading,
}) => {
  return (
    <div className="space-y-8">
      {showCategoryForm && (
        <div className="p-8 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-900/80 min-h-screen">
          <CategoryForm
            mode={categoryFormMode}
            initialData={categoryInitialData}
            onSubmit={onCategorySubmit}
            onCancel={onCategoryCancel}
            loading={categoryLoading}
          />
        </div>
      )}

      {showSubcategoryForm && (
        <div className="max-w-2xl mx-auto px-4">
          <SubcategoryForm
            mode={subcategoryFormMode}
            initialData={subcategoryInitialData}
            onSubmit={onSubcategorySubmit}
            onCancel={onSubcategoryCancel}
            loading={subcategoryLoading}
          />
        </div>
      )}
    </div>
  );
};
