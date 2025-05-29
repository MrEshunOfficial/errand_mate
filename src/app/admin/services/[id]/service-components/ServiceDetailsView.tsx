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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/app/admin/[id]/services/new/LoadingSpiner";

// Types
interface Service {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  icon?: string;
  isActive: boolean;
  popular?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceDetailViewProps {
  currentService: Service | null;
  serviceId: string;
  isLoading: boolean;
  isDeleting: boolean;
  isToggling: boolean;
  imageLoaded: boolean;
  error: string | null;
  onDelete: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
  onBack: () => void;
  onImageLoad: () => void;
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
  hidden: { opacity: 0, y: 30 },
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
          className="max-w-md w-full"
        >
          <Alert
            variant="destructive"
            className="shadow-xl border-0 bg-white dark:bg-gray-800"
          >
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={onBack}
              className="mt-6 w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
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
          className="max-w-md w-full"
        >
          <Alert className="shadow-xl border-0 bg-white dark:bg-gray-800">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-base">
              Service not found.
            </AlertDescription>
          </Alert>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={onBack}
              className="mt-6 w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
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
          className="space-y-8"
        >
          {/* Enhanced Header */}
          <motion.div variants={cardVariants}>
            <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 p-6 lg:p-8">
              <motion.div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start space-x-6">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={onBack}
                      variant="outline"
                      size="lg"
                      className="h-12 px-6 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-md"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      {currentService.icon && (
                        <motion.div
                          className="text-4xl p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <span className="filter drop-shadow-sm">
                            {currentService.icon}
                          </span>
                        </motion.div>
                      )}
                      <div>
                        <motion.h1
                          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {currentService.title}
                        </motion.h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
                          <Hash className="w-3 h-3 inline mr-1" />
                          {currentService.id}
                        </p>
                      </div>
                    </div>

                    <motion.div
                      className="flex flex-wrap items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-md ${
                          currentService.isActive
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                        }`}
                      >
                        {currentService.isActive ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        {currentService.isActive ? "Active" : "Inactive"}
                      </div>

                      {currentService.popular && (
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md">
                          <Star className="w-4 h-4 mr-2 fill-current" />
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
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={onEdit}
                      size="lg"
                      className="h-12 px-6 bg-blue-600 hover:bg-blue-700 shadow-lg"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      onClick={onToggleStatus}
                      disabled={isToggling}
                      variant="outline"
                      size="lg"
                      className="h-12 px-6 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm shadow-lg"
                    >
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
                    whileTap="tap"
                  >
                    <Button
                      onClick={onDelete}
                      disabled={isDeleting}
                      variant="destructive"
                      size="lg"
                      className="h-12 px-6 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Error Alert */}
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Service Information Card */}
              <motion.div variants={cardVariants}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Service Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Title
                      </label>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {currentService.title}
                      </p>
                    </div>

                    {currentService.description && (
                      <div className="group">
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Description
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                          {currentService.description}
                        </p>
                      </div>
                    )}

                    {currentService.longDescription && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                        <label className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                          Detailed Description
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                          {currentService.longDescription}
                        </p>
                      </div>
                    )}

                    {currentService.tags && currentService.tags.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-3 mt-3">
                          {currentService.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-all"
                            >
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
            <div className="space-y-8">
              {/* Status & Quick Info */}
              <motion.div variants={cardVariants}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Status Overview
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Service Status
                      </span>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          currentService.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {currentService.isActive ? "ACTIVE" : "INACTIVE"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        Popularity
                      </span>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          currentService.popular
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-300"
                        }`}
                      >
                        {currentService.popular ? "POPULAR" : "REGULAR"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Metadata */}
              <motion.div variants={cardVariants}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Metadata
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {currentService.createdAt && (
                      <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Created
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-gray-300 text-right font-medium">
                          {formatDate(currentService.createdAt)}
                        </span>
                      </div>
                    )}

                    {currentService.updatedAt && (
                      <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Updated
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-gray-300 text-right font-medium">
                          {formatDate(currentService.updatedAt)}
                        </span>
                      </div>
                    )}
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
