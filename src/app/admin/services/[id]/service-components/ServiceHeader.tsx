// src/app/admin/services/[id]/components/ServiceDetailHeader.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Star,
  Hash,
  Settings,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Service {
  id: string;
  title: string;
  isActive: boolean;
  popular?: boolean;
}

interface ServiceDetailHeaderProps {
  currentService: Service;
  isDeleting: boolean;
  isToggling: boolean;
  onDelete: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
  onBack: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function ServiceDetailHeader({
  currentService,
  isDeleting,
  isToggling,
  onDelete,
  onToggleStatus,
  onEdit,
  onBack,
}: ServiceDetailHeaderProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={onBack}
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={onEdit}
              className="h-12 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={onToggleStatus}
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
                onClick={onEdit}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Service
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onToggleStatus}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Toggle Status
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
              <DropdownMenuItem
                onClick={onDelete}
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
  );
}
