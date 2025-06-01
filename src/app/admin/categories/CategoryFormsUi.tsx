import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/store/type/service-categories";
import { useCategories } from "@/hooks/useCategory";

interface CategoryFormsUiProps {
  category?: Category | null;
  isEditMode?: boolean;
  onSuccess?: (category: Category) => void;
  onCancel?: () => void;
}

interface FormErrors {
  categoryName?: string;
  description?: string;
  catImage?: string;
  tags?: string;
  general?: string;
}

interface CategoryImage {
  url: string;
  catName: string;
}

export default function CategoryFormsUi({
  category,
  isEditMode = false,
  onSuccess,
  onCancel,
}: CategoryFormsUiProps) {
  const { addCategory, editCategory, loading, error, clearCategoryError } =
    useCategories();

  // Form state
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    catImage: null as CategoryImage | null,
    tags: [] as string[],
  });

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when category changes
  useEffect(() => {
    if (isEditMode && category) {
      setFormData({
        categoryName: category.categoryName || "",
        description: category.description || "",
        catImage: category.catImage || null,
        tags: category.tags || [],
      });
      setImagePreview(category.catImage?.url || "");
    } else {
      // Reset form for create mode
      setFormData({
        categoryName: "",
        description: "",
        catImage: null,
        tags: [],
      });
      setImagePreview("");
    }
    setErrors({});
    clearCategoryError();
  }, [category, isEditMode, clearCategoryError]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          catImage: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          catImage: "Image size should be less than 5MB",
        }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImagePreview(url);
        setFormData((prev) => ({
          ...prev,
          catImage: {
            url,
            catName: file.name,
          },
        }));
      };
      reader.readAsDataURL(file);

      // Clear image error
      setErrors((prev) => ({
        ...prev,
        catImage: undefined,
      }));
    }
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");

      // Clear tag error
      setErrors((prev) => ({
        ...prev,
        tags: undefined,
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    } else if (formData.categoryName.trim().length < 2) {
      newErrors.categoryName = "Category name must be at least 2 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, general: undefined }));

    try {
      if (isEditMode && category) {
        const updateData: UpdateCategoryInput = {
          _id: category._id,
          categoryName: formData.categoryName.trim(),
          description: formData.description.trim() || undefined,
          catImage: formData.catImage || undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        };

        const result = await editCategory(category._id.toString(), updateData);
        if (result.type.endsWith("/fulfilled")) {
          onSuccess?.(result.payload as Category);
        }
      } else {
        const createData: CreateCategoryInput = {
          categoryName: formData.categoryName.trim(),
          description: formData.description.trim() || undefined,
          catImage: formData.catImage || undefined,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        };

        const result = await addCategory(createData);
        if (result.type.endsWith("/fulfilled")) {
          onSuccess?.(result.payload as Category);
          // Reset form after successful creation
          setFormData({
            categoryName: "",
            description: "",
            catImage: null,
            tags: [],
          });
          setImagePreview("");
          setTagInput("");
        }
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form
      setFormData({
        categoryName: "",
        description: "",
        catImage: null,
        tags: [],
      });
      setImagePreview("");
      setTagInput("");
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 px-8 py-12">
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {isEditMode ? "Edit Category" : "Create Category"}
                  </h1>
                  <p className="text-blue-100 dark:text-blue-200 mt-1 text-lg">
                    {isEditMode
                      ? "Update your category with new information"
                      : "Add a new category to organize your content"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error */}
              {(errors.general || error) && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400 dark:text-red-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {errors.general || error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Name */}
              <div className="space-y-2">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Category Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="categoryName"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 ${
                      errors.categoryName
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-slate-500"
                    } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Enter a descriptive category name"
                    disabled={isSubmitting || loading}
                  />
                  {formData.categoryName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.categoryName && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.categoryName}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 resize-none ${
                      errors.description
                        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-slate-500"
                    } text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="Provide a detailed description of this category..."
                    disabled={isSubmitting || loading}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {errors.description ? (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.description}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <p
                    className={`text-sm ${
                      formData.description.length > 400
                        ? "text-red-500 dark:text-red-400"
                        : formData.description.length > 300
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Category Image
                </label>

                <div className="relative">
                  <input
                    type="file"
                    id="catImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isSubmitting || loading}
                  />
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 bg-gray-50/50 dark:bg-slate-700/30">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>

                {imagePreview && (
                  <div className="relative group">
                    <Image
                      src={imagePreview}
                      alt="Category preview"
                      width={600}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg"
                      style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setFormData((prev) => ({ ...prev, catImage: null }));
                      }}
                      className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                      disabled={isSubmitting || loading}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {errors.catImage && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.catImage}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tags
                </label>

                <div className="flex rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition-all duration-200">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Add tags to help categorize (press Enter or comma)"
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                    disabled={isSubmitting || loading}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!tagInput.trim() || isSubmitting || loading}
                  >
                    Add
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
                            disabled={isSubmitting || loading}
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {errors.tags && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.tags}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-slate-600"
                  disabled={isSubmitting || loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={isSubmitting || loading}
                >
                  {(isSubmitting || loading) && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isEditMode
                          ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                      }
                    />
                  </svg>
                  {isEditMode ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
