// pages/public/categories/PublicCategoriesPage.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Category } from "@/store/type/service-categories";
import BaseCategoriesPage, {
  CategoryActionConfig,
  CategoryPageMode,
} from "@/components/ui/CategoryServiceBaseComponent";

interface PublicCategoriesPageProps {
  // Optional props to customize behavior
  showRequestButton?: boolean;
  showViewServices?: boolean;
  onCustomServiceRequest?: (categoryId: string) => void;
  onCustomCategoryView?: (category: Category) => void;
}

export default function PublicCategoriesPage({
  showRequestButton = true,
  showViewServices = true,
  onCustomCategoryView,
}: PublicCategoriesPageProps) {
  const router = useRouter();

  // Configure action settings for public mode
  const actionConfig: CategoryActionConfig = {
    mode: "public" as CategoryPageMode,
    showCreate: showRequestButton,
    showView: showViewServices,
    showServices: showRequestButton,
    customActions: [],
  };

  // Handle category viewing
  const handleCategoryView = async (category: Category) => {
    try {
      if (onCustomCategoryView) {
        await onCustomCategoryView(category);
      } else {
        // Default behavior - navigate to category services page
        router.push(`/errand-services/categories/${category._id}`);
      }
    } catch (error) {
      console.error("Failed to view category:", error);
      toast.error("Failed to view category services");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BaseCategoriesPage
        actionConfig={actionConfig}
        title="Browse Services"
        subtitle="Discover our comprehensive range of professional services tailored to your needs"
        createButtonText="Request Custom Service"
        createButtonLink="/services/request"
        emptyStateTitle="No services available"
        emptyStateDescription="We're constantly expanding our service offerings. Check back soon or request a custom service."
        emptyStateActionText="Request Service"
        emptyStateActionLink="/services/request"
        onCategoryView={handleCategoryView}
      />
    </div>
  );
}

// Export types for reuse
export type { PublicCategoriesPageProps };
