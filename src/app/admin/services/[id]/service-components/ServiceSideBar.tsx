// src/app/admin/services/[id]/components/ServiceDetailSidebar.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  CreditCard,
  Calendar,
  Hash,
  Eye,
  Settings,
  Clock,
  Info,
} from "lucide-react";

interface Service {
  id: string;
  isActive: boolean;
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

interface ServiceDetailSidebarProps {
  currentService: Service;
  isDeleting: boolean;
  isToggling: boolean;
  onDelete: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
}

const scaleVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function ServiceDetailSidebar({
  currentService,
  isDeleting,
  isToggling,
  onDelete,
  onToggleStatus,
  onEdit,
}: ServiceDetailSidebarProps) {
  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
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
                  {currentService.pricing.additionalFees.map((fee, index) => (
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
                          {currentService?.pricing?.currency || "USD"}
                        </span>
                      </div>
                      {fee.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {fee.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
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
            <CardTitle className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
              <Clock className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service ID */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Service ID
                </span>
              </div>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {currentService.id}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </span>
              </div>
              <Badge
                variant={currentService.isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {currentService.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Created Date */}
            {currentService.createdAt && (
              <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 text-right">
                  {formatDate(currentService.createdAt)}
                </span>
              </div>
            )}

            {/* Updated Date */}
            {currentService.updatedAt && (
              <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Updated
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 text-right">
                  {formatDate(currentService.updatedAt)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Card */}
      <motion.div variants={scaleVariants}>
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
              <Settings className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onEdit}
                className="w-full justify-start h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-3" />
                Edit Service Details
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onToggleStatus}
                disabled={isToggling}
                className={`w-full justify-start h-12 border ${
                  currentService.isActive
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                }`}
                variant="outline"
              >
                {currentService.isActive ? (
                  <ToggleLeft className="w-4 h-4 mr-3" />
                ) : (
                  <ToggleRight className="w-4 h-4 mr-3" />
                )}
                {isToggling
                  ? "Updating..."
                  : currentService.isActive
                  ? "Deactivate Service"
                  : "Activate Service"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onDelete}
                disabled={isDeleting}
                className="w-full justify-start h-12 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                variant="outline"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                {isDeleting ? "Deleting..." : "Delete Service"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
