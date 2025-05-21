"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Folder,
  Edit,
  Save,
  X,
  Trash2,
  Calendar,
  Hash,
  FileText,
  Palette,
  AlertTriangle,
} from "lucide-react";

// Category interface
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  subcategories: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Available icons for categories
const AVAILABLE_ICONS = [
  { value: "folder", label: "Folder", icon: "📁" },
  { value: "tag", label: "Tag", icon: "🏷️" },
  { value: "star", label: "Star", icon: "⭐" },
  { value: "heart", label: "Heart", icon: "❤️" },
  { value: "briefcase", label: "Briefcase", icon: "💼" },
  { value: "home", label: "Home", icon: "🏠" },
  { value: "car", label: "Car", icon: "🚗" },
  { value: "book", label: "Book", icon: "📚" },
  { value: "computer", label: "Computer", icon: "💻" },
  { value: "phone", label: "Phone", icon: "📱" },
  { value: "camera", label: "Camera", icon: "📷" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "shopping", label: "Shopping", icon: "🛒" },
  { value: "food", label: "Food", icon: "🍕" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "health", label: "Health", icon: "🏥" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "art", label: "Art", icon: "🎨" },
  { value: "tools", label: "Tools", icon: "🔧" },
];

// Form data interface
interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
}

// Props interface
interface CategoryDetailsProps {
  category: Category;
  onUpdateCategory: (data: Partial<Category>) => void;
  onDeleteCategory: () => void;
  loading?: boolean;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  category,
  onUpdateCategory,
  onDeleteCategory,
  loading = false,
}) => {
  // State management
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    icon: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CategoryFormData>>({});

  // Initialize form data when category changes or edit mode is activated
  useEffect(() => {
    if (category && editMode) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "folder",
      });
      setFormErrors({});
    }
  }, [category, editMode]);

  // Validation function
  const validateForm = (): boolean => {
    const errors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Category name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 200) {
      errors.description = "Description must be less than 200 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle edit mode activation
  const handleEditCategory = () => {
    setEditMode(true);
  };

  // Handle form submission
  const handleUpdateCategory = () => {
    if (!validateForm()) {
      return;
    }

    const updatedData: Partial<Category> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      icon: formData.icon,
    };

    onUpdateCategory(updatedData);
    setEditMode(false);
    setFormData({ name: "", description: "", icon: "" });
  };

  // Handle edit cancellation
  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({ name: "", description: "", icon: "" });
    setFormErrors({});
  };

  // Handle category deletion
  const handleDeleteConfirm = () => {
    onDeleteCategory();
    setDeleteDialogOpen(false);
  };

  // Get icon display
  const getIconDisplay = (iconValue: string) => {
    const iconData = AVAILABLE_ICONS.find((icon) => icon.value === iconValue);
    return iconData ? iconData.icon : "📁";
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700 mb-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <Folder className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        Category Details
      </h3>

      {editMode ? (
        // Edit Mode Form
        <div className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-category-name"
              className="text-slate-700 dark:text-slate-300 flex items-center"
            >
              <FileText className="mr-1 h-4 w-4" />
              Category Name *
            </Label>
            <Input
              id="edit-category-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter category name"
              className={`w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 ${
                formErrors.name ? "border-red-500 dark:border-red-500" : ""
              }`}
              disabled={loading}
            />
            {formErrors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {formErrors.name}
              </p>
            )}
          </div>

          {/* Category Description */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-category-description"
              className="text-slate-700 dark:text-slate-300 flex items-center"
            >
              <FileText className="mr-1 h-4 w-4" />
              Description
            </Label>
            <Textarea
              id="edit-category-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter category description (optional)"
              rows={3}
              className={`w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 resize-none ${
                formErrors.description
                  ? "border-red-500 dark:border-red-500"
                  : ""
              }`}
              disabled={loading}
            />
            <div className="flex justify-between items-center">
              {formErrors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {formErrors.description}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                {formData.description.length}/200 characters
              </p>
            </div>
          </div>

          {/* Category Icon */}
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300 flex items-center">
              <Palette className="mr-1 h-4 w-4" />
              Icon
            </Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => handleInputChange("icon", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">
                      {getIconDisplay(formData.icon)}
                    </span>
                    {AVAILABLE_ICONS.find(
                      (icon) => icon.value === formData.icon
                    )?.label || "Select an icon"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                {AVAILABLE_ICONS.map((iconOption) => (
                  <SelectItem
                    key={iconOption.value}
                    value={iconOption.value}
                    className="hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{iconOption.icon}</span>
                      {iconOption.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Button
              onClick={handleUpdateCategory}
              disabled={loading || !formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={loading}
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-6">
          {/* Category Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category ID */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <Hash className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Category ID
                </span>
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-mono text-sm break-all">
                {category.id}
              </span>
            </div>

            {/* Services Count */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <Folder className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Services Count
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-800 dark:text-slate-200 text-xl font-bold mr-2">
                  {category.subcategories.length}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {category.subcategories.length === 1 ? "service" : "services"}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Created
                </span>
              </div>
              <span className="text-slate-800 dark:text-slate-200 text-sm">
                {formatDate(category.createdAt)}
              </span>
            </div>

            {/* Updated Date */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Last Updated
                </span>
              </div>
              <span className="text-slate-800 dark:text-slate-200 text-sm">
                {formatDate(category.updatedAt)}
              </span>
            </div>
          </div>

          {/* Category Icon and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Icon */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <Palette className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Icon
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {getIconDisplay(category.icon || "folder")}
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  {AVAILABLE_ICONS.find((icon) => icon.value === category.icon)
                    ?.label || "Folder"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Description
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                {category.description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Button
              onClick={handleEditCategory}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Button>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={loading}
                  className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
                    Delete Category
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete the category &quot;
                    {category.name}&quot;? This action cannot be undone and will
                    also delete all {category.subcategories.length} associated
                    service{category.subcategories.length !== 1 ? "s" : ""}.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                    className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
