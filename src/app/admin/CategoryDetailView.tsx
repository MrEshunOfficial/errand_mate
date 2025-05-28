"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Edit3,
  Eye,
  Plus,
  Settings,
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  Category,
  CategoryWithServices,
  Service,
} from "@/store/type/service-categories";

interface CategoryDetailViewProps {
  category: Category | CategoryWithServices;
}

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
}) => {
  const hasServices = "services" in category;
  const services = hasServices ? category.services : [];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

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

  return (
    <TooltipProvider>
      <motion.div
        className="max-w-6xl mx-auto p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* Category Header Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    {category.icon ? (
                      <div className="text-6xl">{category.icon}</div>
                    ) : (
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
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
                      <CardDescription className="text-lg leading-relaxed max-w-2xl text-muted-foreground">
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
                      <Button variant="outline" asChild className="gap-2">
                        <Link href={`/admin/${category.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                          Edit Category
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit category details</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild className="gap-2">
                        <Link href={`/admin/${category.id}/services/new`}>
                          <Plus className="h-4 w-4" />
                          Add Service
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create a new service in this category</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent>
              <Separator className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="text-center p-4 rounded-lg border bg-card/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-muted-foreground mb-1">
                    Service Count
                  </div>
                  <div className="text-2xl font-bold">
                    {category.serviceCount || services.length || 0}
                  </div>
                </motion.div>

                <motion.div
                  className="text-center p-4 rounded-lg border bg-card/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm text-muted-foreground mb-1">
                    Created
                  </div>
                  <div className="text-2xl font-bold">
                    {formatDate(category.createdAt)}
                  </div>
                </motion.div>

                <motion.div
                  className="text-center p-4 rounded-lg border bg-card/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm text-muted-foreground mb-1">
                    Last Updated
                  </div>
                  <div className="text-2xl font-bold">
                    {formatDate(category.updatedAt)}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">
                    Services in this Category
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {services.length} service{services.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {services.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}>
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No services yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    This category doesn&apos;t have any services. Start by
                    adding your first service to get things rolling.
                  </p>
                  <Button asChild className="gap-2">
                    <Link href={`/admin/${category.id}/services/new`}>
                      <Plus className="h-4 w-4" />
                      Add First Service
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {services.map((service: Service, index: number) => (
                    <motion.div
                      key={service.id}
                      variants={serviceItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}>
                      <Card className="border border-border/50 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-4">
                                {service.icon ? (
                                  <span className="text-3xl">
                                    {service.icon}
                                  </span>
                                ) : (
                                  <Avatar>
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                      {getInitials(service.title)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {service.title}
                                  </h3>
                                  <p className="text-muted-foreground mt-1">
                                    {service.description}
                                  </p>
                                </div>
                              </div>

                              {/* Service Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Price:
                                  </span>
                                  <span className="font-semibold">
                                    {formatCurrency(
                                      service.pricing.basePrice,
                                      service.pricing.currency
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                  <TrendingUp className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Status:
                                  </span>
                                  <Badge
                                    variant={
                                      service.isActive
                                        ? "default"
                                        : "destructive"
                                    }>
                                    {service.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                                  <Star className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Popular:
                                  </span>
                                  <Badge
                                    variant={
                                      service.popular ? "secondary" : "outline"
                                    }>
                                    {service.popular ? "Yes" : "No"}
                                  </Badge>
                                </div>
                              </div>

                              {/* Tags */}
                              {service.tags && service.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {service.tags.map((tag, tagIndex) => (
                                    <motion.div
                                      key={tagIndex}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: tagIndex * 0.05 }}>
                                      <Badge variant="outline">{tag}</Badge>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 ml-6">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link
                                      href={`/admin/services/${service.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View service details</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link
                                      href={`/admin/services/${service.id}/edit`}>
                                      <Edit3 className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit service</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};
