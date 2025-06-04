// components/admin/AdminCategoriesComponent.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Category } from "@/store/type/service-categories";
import BaseCategoriesPage, {
  CategoryActionConfig,
  CategoryPageMode,
} from "@/components/ui/CategoryServiceBaseComponent";

interface AdminCategoriesPageProps {
  // Optional props to customize behavior
  showCreateButton?: boolean;
  showEditActions?: boolean;
  showDeleteActions?: boolean;
  showViewActions?: boolean;
  onCustomEdit?: (category: Category) => void;
  onCustomDelete?: (id: string) => void;
  onCustomView?: (category: Category) => void;
}

export default function AdminCategoriesComponent({
  showCreateButton = true,
  showEditActions = true,
  showDeleteActions = true,
  showViewActions = true,
  onCustomEdit,
  onCustomDelete,
  onCustomView,
}: AdminCategoriesPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Configure action settings for admin mode
  const actionConfig: CategoryActionConfig = {
    mode: "admin" as CategoryPageMode,
    showCreate: showCreateButton,
    showEdit: showEditActions,
    showDelete: showDeleteActions,
    showView: showViewActions,
    customActions: [],
  };

  // Handle category editing
  const handleCategoryEdit = async (category: Category) => {
    try {
      if (onCustomEdit) {
        await onCustomEdit(category);
      } else {
        // Default behavior - navigate to edit page
        router.push(`/admin/categories/${category._id}/edit`);
      }
    } catch (error) {
      console.error("Failed to handle category edit:", error);
      toast.error("Failed to open category for editing");
    }
  };

  // Handle category viewing
  const handleCategoryView = async (category: Category) => {
    try {
      if (onCustomView) {
        await onCustomView(category);
      } else {
        // Default behavior - navigate to category details
        router.push(`/admin/categories/${category._id}`);
      }
    } catch (error) {
      console.error("Failed to handle category view:", error);
      toast.error("Failed to view category details");
    }
  };

  // Handle category deletion
  const handleCategoryDelete = async (id: string) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      if (onCustomDelete) {
        await onCustomDelete(id);
        toast.success("Category deleted successfully");
      } else {
        // Default behavior would be handled by the base component
        // through the useCategories hook
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BaseCategoriesPage
        actionConfig={actionConfig}
        title="Category Management"
        subtitle="Manage your service categories and organize your offerings"
        createButtonText="Create New Category"
        createButtonLink="/admin/categories/create"
        emptyStateTitle="No categories created yet"
        emptyStateDescription="Start by creating your first service category to organize your offerings"
        emptyStateActionText="Create First Category"
        emptyStateActionLink="/admin/categories/create"
        onCategoryView={handleCategoryView}
        onCategoryEdit={handleCategoryEdit}
        onCategoryDelete={handleCategoryDelete}
      />
    </div>
  );
}

// Export types for reuse
export type { AdminCategoriesPageProps };
