// Clean ServiceDetailView Component
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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
  pricing?: {
    basePrice?: number;
    currency?: string;
    percentageCharge?: number;
    additionalFees?: Array<{
      name: string;
      amount: number;
      description?: string;
    }>;
    pricingNotes?: string;
  };
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
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Alert variant="destructive" className="shadow-lg">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={onBack} className="mt-4 w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Alert className="shadow-lg">
            <AlertDescription>Service not found.</AlertDescription>
          </Alert>
          <Button onClick={onBack} className="mt-4 w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <div className="flex items-center space-x-3">
                {currentService.icon && (
                  <div className="text-3xl">{currentService.icon}</div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentService.title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {currentService.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={onToggleStatus}
                disabled={isToggling}
                variant={currentService.isActive ? "default" : "secondary"}
                size="sm"
              >
                {currentService.isActive ? (
                  <ToggleRight className="w-4 h-4 mr-2" />
                ) : (
                  <ToggleLeft className="w-4 h-4 mr-2" />
                )}
                {isToggling
                  ? "..."
                  : currentService.isActive
                  ? "Active"
                  : "Inactive"}
              </Button>

              <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                onClick={onDelete}
                disabled={isDeleting}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Service Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Title
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {currentService.title}
                    </p>
                  </div>

                  {currentService.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </label>
                      <p className="text-gray-700 dark:text-gray-300">
                        {currentService.description}
                      </p>
                    </div>
                  )}

                  {currentService.longDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Long Description
                      </label>
                      <p className="text-gray-700 dark:text-gray-300">
                        {currentService.longDescription}
                      </p>
                    </div>
                  )}

                  {currentService.tags && currentService.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentService.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Info */}
              {currentService.pricing && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Pricing Information
                  </h2>

                  <div className="space-y-4">
                    {currentService.pricing.basePrice && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Base Price
                        </label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {currentService.pricing.currency || "USD"}{" "}
                          {currentService.pricing.basePrice}
                        </p>
                      </div>
                    )}

                    {currentService.pricing.percentageCharge && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Percentage Charge
                        </label>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentService.pricing.percentageCharge}%
                        </p>
                      </div>
                    )}

                    {currentService.pricing.pricingNotes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Pricing Notes
                        </label>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentService.pricing.pricingNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Status
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Active
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        currentService.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {currentService.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Popular
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        currentService.popular
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {currentService.popular ? "Popular" : "Regular"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Meta Information
                </h3>

                <div className="space-y-3 text-sm">
                  {currentService.createdAt && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Created:
                      </span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(
                          currentService.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {currentService.updatedAt && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Updated:
                      </span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(
                          currentService.updatedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
