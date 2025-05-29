// src/app/admin/services/[id]/components/ServiceDetailHeader.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Power,
  PowerOff,
  Star,
  Hash,
  Settings,
  MoreVertical,
  Shield,
  Clock,
  Zap,
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

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative">
      {/* Main Header Card */}
      <div className="bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10" />

        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left Section - Service Info */}
            <div className="flex-1 space-y-6">
              {/* Back Button */}
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="group h-11 px-4 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-600/50">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Back to Services
                  </span>
                </Button>
              </motion.div>

              {/* Service Title & ID */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight">
                    {currentService.title}
                  </h1>
                </div>

                {/* Service ID Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="h-7 px-3 bg-gray-50/80 dark:bg-gray-700/50 border-gray-200/60 dark:border-gray-600/60 text-gray-600 dark:text-gray-400 font-mono text-xs backdrop-blur-sm">
                    <Hash className="w-3 h-3 mr-1.5" />
                    ID: {currentService.id.slice(-8).toUpperCase()}
                  </Badge>
                </div>
              </motion.div>

              {/* Status Badges */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Active Status Badge */}
                  <Badge
                    className={`h-8 px-4 font-semibold rounded-full shadow-sm ${
                      currentService.isActive
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25"
                        : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-500/25"
                    }`}>
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        currentService.isActive
                          ? "bg-white shadow-sm animate-pulse"
                          : "bg-gray-200"
                      }`}
                    />
                    {currentService.isActive ? "Live Service" : "Inactive"}
                  </Badge>

                  {/* Popular Badge */}
                  {currentService.popular && (
                    <Badge className="h-8 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full shadow-sm shadow-amber-500/25">
                      <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                      Popular Choice
                    </Badge>
                  )}

                  {/* Additional Status Indicators */}
                  <Badge
                    variant="outline"
                    className="h-8 px-4 bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-700/60 text-blue-700 dark:text-blue-300 font-medium rounded-full">
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    Verified
                  </Badge>
                </div>
              </motion.div>
            </div>

            {/* Right Section - Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Primary Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={onEdit}
                  className="group h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 transition-all duration-200 hover:-translate-y-0.5">
                  <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Edit Service
                </Button>

                <Button
                  onClick={onToggleStatus}
                  disabled={isToggling}
                  variant="outline"
                  className={`group h-12 px-6 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                    currentService.isActive
                      ? "border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 shadow-sm hover:shadow-red-500/10"
                      : "border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 shadow-sm hover:shadow-green-500/10"
                  }`}>
                  {isToggling ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentService.isActive ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Activate
                    </>
                  )}
                </Button>
              </div>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl p-2">
                  <DropdownMenuItem
                    onClick={onEdit}
                    className="rounded-xl py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <Edit3 className="w-4 h-4 mr-3" />
                    <span className="font-medium">Edit Service Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onToggleStatus}
                    className="rounded-xl py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <Zap className="w-4 h-4 mr-3" />
                    <span className="font-medium">Toggle Service Status</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <Settings className="w-4 h-4 mr-3" />
                    <span className="font-medium">Service Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-600/50 my-2" />
                  <DropdownMenuItem
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="rounded-xl py-3 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400 transition-colors duration-150">
                    <Trash2 className="w-4 h-4 mr-3" />
                    <span className="font-medium">
                      {isDeleting ? "Deleting Service..." : "Delete Service"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
