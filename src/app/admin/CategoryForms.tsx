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
    <Card className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100 dark:shadow-slate-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <FolderPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {mode === "create" ? "Create New Category" : "Edit Category"}
            </CardTitle>
            <p className="text-slate-500 dark:text-slate-400">
              {mode === "create"
                ? "Add a new category to organize your services"
                : "Update category information"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="category-name"
                  className="text-slate-700 dark:text-slate-300 block mb-2 font-medium"
                >
                  Category Name *
                </Label>
                <Input
                  id="category-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter category name"
                  className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="category-description"
                  className="text-slate-700 dark:text-slate-300 block mb-2 font-medium"
                >
                  Description (Optional)
                </Label>
                <Input
                  id="category-description"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter category description"
                  className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <Label
                  htmlFor="category-icon"
                  className="text-slate-700 dark:text-slate-300 block mb-2 font-medium"
                >
                  Icon (Optional)
                </Label>
                <Input
                  id="category-icon"
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                  placeholder="Enter icon name or emoji"
                  className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30 disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Category"
                  : "Save Changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
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
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <List className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        {mode === "create" ? "Add New Service" : "Edit Service"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <Label
              htmlFor="subcategory-name"
              className="text-slate-700 dark:text-slate-300 block mb-2 font-medium"
            >
              Service Name *
            </Label>
            <Input
              id="subcategory-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter service name"
              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="subcategory-description"
              className="text-slate-700 dark:text-slate-300 block mb-2 font-medium"
            >
              Description (Optional)
            </Label>
            <Input
              id="subcategory-description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter service description"
              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30 disabled:opacity-50"
          >
            {mode === "create" ? (
              <PlusCircle className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Add Service"
              : "Update Service"}
          </Button>

          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
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
    <>
      {showCategoryForm && (
        <div className="p-8">
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
        <div className="space-y-4 mb-6">
          <SubcategoryForm
            mode={subcategoryFormMode}
            initialData={subcategoryInitialData}
            onSubmit={onSubcategorySubmit}
            onCancel={onSubcategoryCancel}
            loading={subcategoryLoading}
          />
        </div>
      )}
    </>
  );
};
