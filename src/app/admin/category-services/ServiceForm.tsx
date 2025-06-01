// src/components/forms/ServiceForm.tsx
"use client";

import { useServices } from "@/hooks/useServices";
import {
  Service,
  CreateServiceInput,
  UpdateServiceInput,
} from "@/store/type/service-categories";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategory";

interface ServiceFormProps {
  initialData?: Service | null;
  categoryId?: string;
  onSubmit: (data: CreateServiceInput | UpdateServiceInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
  onImageUpload?: (file: File) => Promise<string>;
}

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  serviceImage?: {
    url: string;
    serviceName: string;
  };
  popular: boolean;
  isActive: boolean;
  tags: string[];
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  categoryId: propCategoryId,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
  onImageUpload,
}) => {
  const { categories, getCategories } = useCategories();
  const { addService, editService, loading: serviceLoading } = useServices();
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: propCategoryId || "",
    serviceImage: undefined,
    popular: false,
    isActive: true,
    tags: [],
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load categories on mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Initialize form with existing data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        categoryId: initialData.categoryId || "",
        serviceImage: initialData.serviceImage,
        popular: initialData.popular || false,
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
        tags: initialData.tags || [],
      });

      if (initialData.serviceImage?.url) {
        setImagePreview(initialData.serviceImage.url);
      }
    }
  }, [mode, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      serviceImage: {
        ...prev.serviceImage,
        [name]: value,
      } as { url: string; serviceName: string },
    }));

    if (name === "url") {
      setImagePreview(value);
      // Clear uploaded file when URL is provided
      setUploadedFile(null);
    }
  };

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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }

      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Fallback to browser back if no onCancel provided
      window.history.back();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = { ...formData };

      // If there's an uploaded file and no onImageUpload handler was provided,
      // we need to handle the file upload during form submission
      if (uploadedFile && !onImageUpload) {
        // You would implement your file upload logic here
        // For now, we'll just use the preview URL
        submitData.serviceImage = {
          url: imagePreview,
          serviceName: uploadedFile.name,
        };
      }

      // Clean up serviceImage if no URL is provided
      if (!submitData.serviceImage?.url) {
        submitData.serviceImage = undefined;
      }

      if (mode === "edit" && initialData) {
        await editService(
          initialData._id.toString(),
          submitData as UpdateServiceInput
        );
      } else {
        await addService(submitData as CreateServiceInput);
      }

      // Call the onSubmit prop if provided (for additional handling)
      if (onSubmit) {
        if (mode === "edit" && initialData) {
          await onSubmit({
            ...submitData,
            _id: initialData._id,
          } as UpdateServiceInput);
        } else {
          await onSubmit(submitData as CreateServiceInput);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setUploadedFile(null);
    setFormData((prev) => ({
      ...prev,
      serviceImage: undefined,
    }));
  };

  const isFormLoading = isLoading || serviceLoading;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {mode === "create" ? "Create New Service" : "Edit Service"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Service Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.title
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Enter service title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.description
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Enter service description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            disabled={!!propCategoryId}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.categoryId
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            } ${
              propCategoryId
                ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                : ""
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option
                key={category._id.toString()}
                value={category._id.toString()}
              >
                {category.categoryName}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.categoryId}
            </p>
          )}
        </div>

        {/* Service Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Service Image
          </h3>

          {/* Image Source Toggle */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setImageSource("url")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                imageSource === "url"
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setImageSource("upload")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                imageSource === "upload"
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              Upload Image
            </button>
          </div>

          {imageSource === "url" ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="url"
                  value={formData.serviceImage?.url || ""}
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label
                  htmlFor="imageName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Image Name
                </label>
                <input
                  type="text"
                  id="imageName"
                  name="serviceName"
                  value={formData.serviceImage?.serviceName || ""}
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter image name"
                />
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
              {/* {isUploading && (
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  Uploading image...
                </p>
              )} */}
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview:
              </p>
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Service preview"
                  className="w-48 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  width={192}
                  height={128}
                  onError={() => setImagePreview("")}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tagInput"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tags
          </label>
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Type a tag and press Enter"
          />

          {/* Tag Display */}
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status Toggles */}
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="popular"
              checked={formData.popular}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Popular Service
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isFormLoading}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors ${
              isFormLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isFormLoading
              ? "Saving..."
              : mode === "create"
              ? "Create Service"
              : "Update Service"}
          </button>
        </div>
      </form>
    </div>
  );
};
