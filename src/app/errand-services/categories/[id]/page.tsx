// src/app/admin/categories/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import CategoryHeader from "../../public_ui/PublicHeader";
import ServicesControlPanel from "../../public_ui/PublicServiceControl";
import ServicesGrid from "../../public_ui/PublicServiceGrid";

// Types
interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  popular: number;
}

const CategoryDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  // Hooks
  const {
    selectedCategory,
    loading: categoryLoading,
    error: categoryError,
    getCategoryById,
  } = useCategories();

  const {
    services,
    loading: servicesLoading,
    getServicesByCategory,
  } = useServices();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<
    "all" | "active" | "inactive" | "popular"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Effects
  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId, true);
      getServicesByCategory(categoryId);
    }
  }, [categoryId, getCategoryById, getServicesByCategory]);

  // Statistics calculations
  const stats: CategoryStats = {
    total: services.length,
    active: services.filter((s) => s.isActive).length,
    inactive: services.filter((s) => !s.isActive).length,
    popular: services.filter((s) => s.popular).length,
  };

  // Filtered services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      serviceFilter === "all" ||
      (serviceFilter === "active" && service.isActive) ||
      (serviceFilter === "inactive" && !service.isActive) ||
      (serviceFilter === "popular" && service.popular);

    return matchesSearch && matchesFilter;
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Loading category details...
          </p>
        </div>
      </div>
    );
  }

  if (categoryError || !selectedCategory) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Category Not Found
            </h1>
            <p className="text-muted-foreground mb-6 dark:text-gray-400">
              The category you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Button
              onClick={() => router.push("/admin/categories")}
              className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Category Header */}
      <CategoryHeader
        category={{
          ...selectedCategory,
          _id: selectedCategory._id.toString(),
        }}
        stats={stats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Services Control Panel */}
        <ServicesControlPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          serviceFilter={serviceFilter}
          onFilterChange={setServiceFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filteredCount={filteredServices.length}
          totalCount={services.length}
          stats={stats}
        />

        {/* Services Grid */}
        <ServicesGrid
          services={filteredServices.map((service) => ({
            ...service,
            _id: service._id.toString(),
          }))}
          viewMode={viewMode}
          isLoading={servicesLoading}
        />
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
