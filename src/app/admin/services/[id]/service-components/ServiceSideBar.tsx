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
  Calendar,
  Hash,
  Eye,
  Settings,
  Clock,
} from "lucide-react";

interface Service {
  id: string;
  isActive: boolean;
 
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
