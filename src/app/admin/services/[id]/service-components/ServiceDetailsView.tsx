// Enhanced ServiceDetailView Component
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  Star,
  Hash,
  Calendar,
  Clock,
  Tag,
  FileText,
  Shield,
  Image,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/app/admin/[id]/services/new/LoadingSpiner";

// Types based on your interfaces
interface Service {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  serviceImage?: {
    url: string;
    alt: string;
  };
  popular: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceWithCategory extends Service {
  category: {
    id: string;
    name: string;
  };
}

interface ServiceDetailViewProps {
  currentService: ServiceWithCategory | null;
  serviceId: string;
  isLoading: boolean;
  isDeleting: boolean;
  isToggling: boolean;
  error: string | null;
  onDelete: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
  onBack: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

export function ServiceDetailView({
  currentService,
  isLoading,
  isDeleting,
  isToggling,
  error,
  onDelete,
  onToggleStatus,
  onEdit,
  onBack,
}: ServiceDetailViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full">
          <Alert
            variant="destructive"
            className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap">
            <Button
              onClick={onBack}
              className="mt-6 w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full">
          <Alert className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-base">
              Service not found.
            </AlertDescription>
          </Alert>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap">
            <Button
              onClick={onBack}
              className="mt-6 w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6">
          {/* Header */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      onClick={onBack}
                      variant="outline"
                      size="lg"
                      className="h-11 px-4 border-gray-200 dark:border-gray-600">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <motion.h1
                        className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}>
                        {currentService.title}
                      </motion.h1>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <span className="flex items-center">
                        <Hash className="w-3 h-3 mr-1" />
                        {currentService.id}
                      </span>
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {currentService.category.name}
                      </span>
                    </div>

                    <motion.div
                      className="flex flex-wrap items-center gap-2 mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          currentService.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-300"
                        }`}>
                        {currentService.isActive ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {currentService.isActive ? "Active" : "Inactive"}
                      </div>

                      {currentService.popular && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Popular
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      onClick={onEdit}
                      size="lg"
                      className="h-11 px-4 bg-blue-600 hover:bg-blue-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      onClick={onToggleStatus}
                      disabled={isToggling}
                      variant="outline"
                      size="lg"
                      className="h-11 px-4">
                      {currentService.isActive ? (
                        <ToggleRight className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      {isToggling ? "Updating..." : "Toggle"}
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap">
                    <Button
                      onClick={onDelete}
                      disabled={isDeleting}
                      variant="destructive"
                      size="lg"
                      className="h-11 px-4">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Service Information */}
              <motion.div variants={cardVariants}>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Service Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Description
                      </label>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                        {currentService.description}
                      </p>
                    </div>

                    {currentService.serviceImage && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                          <Image className="w-4 h-4 mr-1" />
                          Service Image
                        </label>
                        <div className="mt-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={currentService.serviceImage.url}
                            alt={currentService.serviceImage.alt}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {currentService.tags && currentService.tags.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {currentService.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-lg border border-purple-200 dark:border-purple-700">
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Overview */}
              <motion.div variants={cardVariants}>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Status Overview
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Service Status
                      </span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          currentService.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                        {currentService.isActive ? "ACTIVE" : "INACTIVE"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Popularity
                      </span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          currentService.popular
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-300"
                        }`}>
                        {currentService.popular ? "POPULAR" : "REGULAR"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Category
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {currentService.category.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Metadata */}
              <motion.div variants={cardVariants}>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gray-600 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Metadata
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Created
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-300 font-medium text-right">
                        {formatDate(currentService.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Updated
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-300 font-medium text-right">
                        {formatDate(currentService.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
