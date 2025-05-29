"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Edit3,
  Eye,
  Plus,
  Settings,
  Star,
  Package,
  Grid3X3,
  List,
  Activity,
} from "lucide-react";
import {
  Category,
  CategoryWithServices,
  Service,
} from "@/store/type/service-categories";

interface CategoryDetailViewProps {
  category: Category | CategoryWithServices;
}

type ViewMode = "grid" | "list";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const serviceItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2, type: "spring", stiffness: 300 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    x: 4,
    transition: { duration: 0.2 },
  },
};

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const hasServices = "services" in category;
  const services = hasServices ? category.services : [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    color: string;
  }

  const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
    <motion.div
      className="relative overflow-hidden rounded-xl border bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  const ServiceGridCard = ({
    service,
    index,
  }: {
    service: Service;
    index: number;
  }) => (
    <motion.div
      variants={serviceItemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      className="group">
      <Card className="relative overflow-hidden border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {service.serviceImage ? (
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={service.serviceImage.url}
                    alt={service.serviceImage.alt || service.title}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {getInitials(service.title)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {getInitials(service.title)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {service.title}
                </CardTitle>
                <Badge
                  variant={service.isActive ? "default" : "destructive"}
                  className="mt-1">
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/services/${service.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View details</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/services/${service.id}/edit`}>
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit service</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {service.popular ? "Popular" : "Standard"}
              </span>
            </div>
          </div>

          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {service.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {service.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{service.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const ServiceListItem = ({
    service,
    index,
  }: {
    service: Service;
    index: number;
  }) => (
    <motion.div
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.05 }}
      className="group">
      <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {service.serviceImage ? (
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={service.serviceImage.url}
                    alt={service.serviceImage.alt || service.title}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {getInitials(service.title)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {getInitials(service.title)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg truncate">
                    {service.title}
                  </h3>
                  <Badge variant={service.isActive ? "default" : "destructive"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {service.popular && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm line-clamp-1 mb-2">
                  {service.description}
                </p>

                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {service.tags.slice(0, 4).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/services/${service.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View details</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/services/${service.id}/edit`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit service</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <motion.div
        className="max-w-7xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* Category Header */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />

            <CardHeader className="relative pb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    {category.catImage ? (
                      <Avatar className="h-20 w-20 shadow-lg">
                        <AvatarImage
                          src={category.catImage.url}
                          alt={category.catImage.alt || category.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(category.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-20 w-20 shadow-lg">
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(category.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>

                  <div className="space-y-3">
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <CardDescription className="text-lg leading-relaxed max-w-2xl">
                        {category.description}
                      </CardDescription>
                    )}
                  </div>
                </div>

                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        asChild
                        className="gap-2 shadow-sm">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                          Edit Category
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit category details</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild className="gap-2 shadow-sm">
                        <Link
                          href={`/admin/services/new?categoryId=${category.id}`}>
                          <Plus className="h-4 w-4" />
                          Add Service
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create a new service</TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <Separator className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={Package}
                  label="Total Services"
                  value={category.serviceCount || services.length || 0}
                  color="from-blue-500 to-blue-600"
                />
                <StatCard
                  icon={Calendar}
                  label="Created"
                  value={formatDate(category.createdAt)}
                  color="from-green-500 to-green-600"
                />
                <StatCard
                  icon={Activity}
                  label="Last Updated"
                  value={formatDate(category.updatedAt)}
                  color="from-purple-500 to-purple-600"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                    <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Services</CardTitle>
                    <CardDescription>
                      Manage services in this category
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {services.length} service{services.length !== 1 ? "s" : ""}
                  </Badge>

                  <div className="flex items-center bg-muted/50 p-1 rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="gap-2">
                      <List className="h-4 w-4" />
                      List
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {services.length === 0 ? (
                  <motion.div
                    key="empty"
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}>
                    <div className="text-6xl mb-6">📝</div>
                    <h3 className="text-2xl font-semibold mb-3">
                      No services yet
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                      This category doesn&apos;t have any services. Start by
                      adding your first service to get things rolling.
                    </p>
                    <Button asChild className="gap-2 shadow-sm">
                      <Link
                        href={`/admin/services/new?categoryId=${category.id}`}>
                        <Plus className="h-4 w-4" />
                        Add Your First Service
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service: Service, index: number) => (
                          <ServiceGridCard
                            key={service.id}
                            service={service}
                            index={index}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {services.map((service: Service, index: number) => (
                          <ServiceListItem
                            key={service.id}
                            service={service}
                            index={index}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};
