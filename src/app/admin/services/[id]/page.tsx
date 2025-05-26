// src/app/admin/services/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Star,
  Tag,
  CreditCard,
  Calendar,
  Hash,
  TrendingUp,
  Eye,
  Settings,
  MoreVertical,
  Info,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const scaleVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const {
    currentService,
    loading,
    error,
    loadService,
    removeService,
    toggleStatus,
    clearService,
    resetErrors,
  } = useServices();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService(serviceId, true);
    }

    return () => {
      clearService();
      resetErrors();
    };
  }, [serviceId, loadService, clearService, resetErrors]);

  const handleDelete = async () => {
    if (!currentService) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentService.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      setIsDeleting(true);
      try {
        await removeService(currentService.id);
        router.push("/admin/services");
      } catch (error) {
        console.error("Failed to delete service:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!currentService) return;

    setIsToggling(true);
    try {
      await toggleStatus(currentService.id);
    } catch (error) {
      console.error("Failed to toggle service status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/services/${serviceId}/edit`);
  };

  const handleBack = () => {
    router.push("/admin/services");
  };

  if (loading.currentService) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  if (error.currentService) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Alert
            variant="destructive"
            className="shadow-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error.currentService}
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleBack}
            className="mt-4 w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </motion.div>
      </div>
    );
  }
  if (!currentService) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Alert className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <AlertDescription className="text-gray-700 dark:text-gray-300">
              Service not found.
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleBack}
            className="mt-4 w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-4 space-y-8"
      >
        {/* Floating Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-12 px-4 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </motion.div>

              <div className="flex-1">
                <motion.h1
                  className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentService.title}
                </motion.h1>

                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge
                    variant={currentService.isActive ? "default" : "secondary"}
                    className="h-6 px-3 font-medium"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        currentService.isActive
                          ? "bg-green-400"
                          : "bg-gray-400 dark:bg-gray-500"
                      }`}
                    />
                    {currentService.isActive ? "Active" : "Inactive"}
                  </Badge>

                  {currentService.popular && (
                    <Badge
                      variant="outline"
                      className="h-6 px-3 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                    >
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}

                  {currentService.id && (
                    <Badge
                      variant="outline"
                      className="h-6 px-3 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {currentService.id.slice(-8)}
                    </Badge>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="h-12 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className="h-12 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {currentService.isActive ? (
                    <ToggleRight className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  )}
                  {isToggling
                    ? "Updating..."
                    : currentService.isActive
                    ? "Deactivate"
                    : "Activate"}
                </Button>
              </motion.div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Service
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleToggleStatus}
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Toggle Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Service"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Image */}
            {currentService.icon && (
              <motion.div variants={scaleVariants}>
                <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-0 relative">
                    <motion.div
                      initial={{ scale: 1.1 }}
                      animate={{ scale: imageLoaded ? 1 : 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="relative overflow-hidden"
                    >
                      <img
                        src={currentService.icon}
                        alt={currentService.title}
                        className="w-full h-80 object-cover"
                        onLoad={() => setImageLoaded(true)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </motion.div>

                    {/* Floating Price Badge */}
                    {currentService.pricing?.basePrice && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-4 right-4"
                      >
                        <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border-0 shadow-lg backdrop-blur-sm px-4 py-2 text-lg font-semibold">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {currentService.pricing.basePrice}{" "}
                          {currentService.pricing.currency || "USD"}
                        </Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Description Section */}
            <motion.div variants={scaleVariants}>
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center text-gray-900 dark:text-white">
                    <Info className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                    Service Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.p
                    className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentService.description || "No description available."}
                  </motion.p>

                  {currentService.longDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800"
                    >
                      <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                        Detailed Information
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentService.longDescription}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags Section */}
            {currentService.tags?.length && (
              <motion.div variants={scaleVariants}>
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                      <Tag className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.1 }}
                    >
                      {currentService.tags.map((tag, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="secondary"
                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-200"
                          >
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Pricing Card */}
            {currentService.pricing && (
              <motion.div variants={scaleVariants}>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center text-green-800 dark:text-green-300">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Pricing Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Base Price */}
                    {currentService.pricing.basePrice && (
                      <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {currentService.pricing.basePrice}{" "}
                          <span className="text-lg text-gray-500 dark:text-gray-400">
                            {currentService.pricing.currency || "USD"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Base Price
                        </p>
                      </motion.div>
                    )}

                    {/* Service Fee */}
                    {currentService.pricing.percentageCharge && (
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Service Fee
                          </span>
                        </div>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {currentService.pricing.percentageCharge}%
                        </span>
                      </div>
                    )}

                    {/* Additional Fees */}
                    {currentService.pricing.additionalFees?.length && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                          Additional Fees
                        </h4>
                        {currentService.pricing.additionalFees.map(
                          (fee, index) => (
                            <motion.div
                              key={index}
                              className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                  {fee.name}
                                </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                  {fee.amount}{" "}
                                  {currentService.pricing.currency || "USD"}
                                </span>
                              </div>
                              {fee.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {fee.description}
                                </p>
                              )}
                            </motion.div>
                          )
                        )}
                      </div>
                    )}

                    {/* Pricing Notes */}
                    {currentService.pricing.pricingNotes && (
                      <motion.div
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-300 text-sm mb-1">
                              Pricing Notes
                            </p>
                            <p className="text-amber-700 dark:text-amber-200 text-sm">
                              {currentService.pricing.pricingNotes}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Metadata Card */}
            <motion.div variants={scaleVariants}>
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200">
                    <Eye className="w-5 h-5 mr-2" />
                    Service Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {currentService.id && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Service ID
                          </span>
                        </div>
                        <code className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                          {currentService.id}
                        </code>
                      </div>
                    )}

                    {currentService.createdAt && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Created
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(
                            currentService.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {currentService.updatedAt && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Last Updated
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(
                            currentService.updatedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={scaleVariants}>
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleEdit}
                      className="w-full h-12 justify-start bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Service
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleToggleStatus}
                      disabled={isToggling}
                      className={`w-full h-12 justify-start border ${
                        currentService.isActive
                          ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-700"
                          : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-700"
                      }`}
                      variant="outline"
                    >
                      {currentService.isActive ? (
                        <ToggleRight className="w-4 h-4 mr-2" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-2" />
                      )}
                      {isToggling
                        ? "Updating..."
                        : currentService.isActive
                        ? "Deactivate Service"
                        : "Activate Service"}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full h-12 justify-start bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete Service"}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
