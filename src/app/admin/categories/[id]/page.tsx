// src/app/admin/categories/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Search,
  MoreVertical,
  Activity,
  Settings,
  Filter,
  Grid3X3,
  List,
  BarChart3,
  Image as ImageIcon,
  FileText,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategory";

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
    removeCategory,
  } = useCategories();

  const {
    services,
    loading: servicesLoading,
    getServicesByCategory,
    removeService,
    toggleActive,
    togglePopular,
  } = useServices();

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
  const stats = {
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

  const handleCategoryDelete = async () => {
    if (!selectedCategory) return;

    try {
      await removeCategory(selectedCategory._id.toString());
      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleServiceDelete = async (serviceId: string) => {
    try {
      await removeService(serviceId);
      getServicesByCategory(categoryId);
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleServiceToggleActive = async (serviceId: string) => {
    try {
      await toggleActive(serviceId);
      getServicesByCategory(categoryId);
    } catch (error) {
      console.error("Failed to toggle service active status:", error);
    }
  };

  const handleServiceTogglePopular = async (serviceId: string) => {
    try {
      await togglePopular(serviceId);
      getServicesByCategory(categoryId);
    } catch (error) {
      console.error("Failed to toggle service popular status:", error);
    }
  };

  const openEditService = (serviceId: string) => {
    router.push(`/admin/category-services/${serviceId}/edit`);
  };

  const handleCreateService = () => {
    router.push(`/admin/category-services/new?categoryId=${categoryId}`);
  };

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
              className="w-full"
            >
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
      {/* Hero Header Section */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin")}
              className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Category
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
                      Delete Category
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                      Are you sure you want to delete &quot;
                      {selectedCategory.categoryName}&quot;? This action cannot
                      be undone and will also remove all {services.length}{" "}
                      associated services.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCategoryDelete}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    >
                      Delete Category
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Category Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            {/* Category Image */}
            {selectedCategory.catImage?.url && (
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <Image
                  src={selectedCategory.catImage.url}
                  alt={selectedCategory.catImage.catName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Category Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedCategory.categoryName}
                </h1>
                <Badge
                  variant="secondary"
                  className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Category
                </Badge>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
                {selectedCategory.description ||
                  "No description provided for this category."}
              </p>

              {/* Tags */}
              {selectedCategory.tags && selectedCategory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-sm border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 dark:text-blue-200 text-sm">
                        Total Services
                      </p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-200 dark:text-blue-300" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 dark:text-green-200 text-sm">
                        Active
                      </p>
                      <p className="text-2xl font-bold">{stats.active}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-200 dark:text-green-300" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 dark:text-yellow-200 text-sm">
                        Popular
                      </p>
                      <p className="text-2xl font-bold">{stats.popular}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-200 dark:text-yellow-300" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-100 dark:text-slate-200 text-sm">
                        Inactive
                      </p>
                      <p className="text-2xl font-bold">{stats.inactive}</p>
                    </div>
                    <EyeOff className="w-8 h-8 text-slate-200 dark:text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 py-4">
        {/* Services Section Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Services Management
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Manage all services in this category ({filteredServices.length}{" "}
                of {services.length} shown)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleCreateService}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <Input
                placeholder="Search services by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter: {serviceFilter === "all" ? "All" : serviceFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                >
                  <DropdownMenuLabel className="text-slate-900 dark:text-slate-100">
                    Filter Services
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem
                    onClick={() => setServiceFilter("all")}
                    className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    All Services ({stats.total})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setServiceFilter("active")}
                    className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Active ({stats.active})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setServiceFilter("inactive")}
                    className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Inactive ({stats.inactive})
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setServiceFilter("popular")}
                    className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Popular ({stats.popular})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg p-1 bg-white dark:bg-slate-800">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 ${
                    viewMode === "grid"
                      ? "bg-slate-900 dark:bg-slate-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 ${
                    viewMode === "list"
                      ? "bg-slate-900 dark:bg-slate-600 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid/List */}
        {servicesLoading ? (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading services...
              </p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <Card className="text-center py-16 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent>
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                No services found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery || serviceFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first service"}
              </p>
              {!searchQuery && serviceFilter === "all" && (
                <Button
                  onClick={handleCreateService}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Service
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredServices.map((service) => (
              <Card
                key={service._id.toString()}
                className={`group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${
                  viewMode === "list" ? "flex items-center p-4" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant={
                                service.isActive ? "default" : "secondary"
                              }
                              className={
                                service.isActive
                                  ? "bg-green-500 dark:bg-green-600"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                              }
                            >
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {service.popular && (
                              <Badge
                                variant="outline"
                                className="border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400"
                              >
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-slate-900 dark:text-slate-100">
                            {service.title}
                          </CardTitle>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                openEditService(service._id.toString())
                              }
                              className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Service
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                            <DropdownMenuItem
                              onClick={() =>
                                handleServiceToggleActive(
                                  service._id.toString()
                                )
                              }
                              className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              {service.isActive ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleServiceTogglePopular(
                                  service._id.toString()
                                )
                              }
                              className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              {service.popular ? (
                                <>
                                  <StarOff className="w-4 h-4 mr-2" />
                                  Remove from Popular
                                </>
                              ) : (
                                <>
                                  <Star className="w-4 h-4 mr-2" />
                                  Mark as Popular
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                            <DropdownMenuItem
                              onClick={() =>
                                handleServiceDelete(service._id.toString())
                              }
                              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Service
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {service.serviceImage?.url && (
                        <div className="mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={service.serviceImage.url}
                            alt={service.serviceImage.serviceName}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                        {service.description}
                      </p>

                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {service.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {service.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                            >
                              +{service.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </>
                ) : (
                  <div className="flex items-center space-x-4 w-full">
                    {service.serviceImage?.url ? (
                      <Image
                        src={service.serviceImage.url}
                        alt={service.serviceImage.serviceName}
                        width={32}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold truncate text-slate-900 dark:text-slate-100">
                          {service.title}
                        </h3>
                        <Badge
                          variant={service.isActive ? "default" : "secondary"}
                          className={`${
                            service.isActive
                              ? "bg-green-500 dark:bg-green-600"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          } flex-shrink-0`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {service.popular && (
                          <Badge
                            variant="outline"
                            className="border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                          >
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            openEditService(service._id.toString())
                          }
                          className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                        <DropdownMenuItem
                          onClick={() =>
                            handleServiceToggleActive(service._id.toString())
                          }
                          className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {service.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleServiceTogglePopular(service._id.toString())
                          }
                          className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {service.popular ? (
                            <>
                              <StarOff className="w-4 h-4 mr-2" />
                              Remove from Popular
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Mark as Popular
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                        <DropdownMenuItem
                          onClick={() =>
                            handleServiceDelete(service._id.toString())
                          }
                          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
