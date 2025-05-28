// app/admin/categories/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategory";
import { CreateCategoryInput } from "@/store/type/service-categories";
import CategoryForm from "../CategoryFormUi";

export default function AddCategoryPage() {
  const router = useRouter();
  const { createCategory, createLoading, error, clearError } = useCategories();

  const handleSubmit = async (data: CreateCategoryInput) => {
    try {
      await createCategory(data);
      router.push("/admin");
    } catch (err) {
      console.error("Failed to create category:", err);
      throw err; // Re-throw to let the form component handle it
    }
  };

  return (
    <CategoryForm
      mode="create"
      onSubmit={handleSubmit}
      isLoading={createLoading}
      error={error}
      onClearError={clearError}
      backUrl="/admin"
    />
  );
}
