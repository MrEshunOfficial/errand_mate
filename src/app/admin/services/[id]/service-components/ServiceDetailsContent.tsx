// src/app/admin/services/[id]/components/ServiceDetailContent.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Tag,
  FileText,
  Sparkles,
  Info,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  icon?: string;
  tags?: string[];
}

interface ServiceDetailContentProps {
  currentService: Service;
  imageLoaded: boolean;
  onImageLoad: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const imageVariants = {
  hidden: { scale: 1.2, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export function ServiceDetailContent({
  currentService,
  imageLoaded,
  onImageLoad,
}: ServiceDetailContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="lg:col-span-3 space-y-8"
    >
      {/* Hero Image Section */}
      {currentService.icon && (
        <motion.div variants={cardVariants}>
          <Card className="group overflow-hidden border-0 shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] transition-all duration-500">
            <CardContent className="p-0 relative">
              <motion.div
                variants={imageVariants}
                className="relative overflow-hidden rounded-t-3xl"
              >
                <motion.img
                  src={currentService.icon}
                  alt={currentService.title}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  onLoad={onImageLoad}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Enhanced gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

                {/* Image status indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 0.8,
                  }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4"
                >
                  <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white shadow-lg">
                    <Eye className="w-3 h-3 mr-1.5" />
                    Service Preview
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Bottom gradient bar for visual enhancement */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Description Section */}
      <motion.div variants={cardVariants}>
        <Card className="border-0 shadow-[0_4px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)] bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 backdrop-blur-sm hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all duration-500 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-purple-900/20">
            <CardTitle className="text-2xl font-bold flex items-center text-gray-900 dark:text-white">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mr-4 shadow-lg shadow-blue-500/25">
                <FileText className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Service Overview
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* Main Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Info className="w-4 h-4 mr-2 text-blue-500" />
                Description
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-gray-50/50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-600/30">
                {currentService.description ||
                  "No description available for this service."}
              </p>
            </motion.div>

            {/* Long Description */}
            {currentService.longDescription && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30 rounded-3xl p-8 border border-blue-100/60 dark:border-blue-800/40 shadow-inner">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mr-3 shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                      Detailed Information
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {currentService.longDescription}
                  </p>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-lg" />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Tags Section */}
      {currentService.tags?.length && (
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-[0_4px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)] bg-gradient-to-br from-white via-purple-50/20 to-white dark:from-gray-800 dark:via-purple-900/10 dark:to-gray-900 backdrop-blur-sm hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all duration-500 rounded-3xl overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-purple-50/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-purple-900/20">
              <CardTitle className="text-2xl font-bold flex items-center text-gray-900 dark:text-white">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mr-4 shadow-lg shadow-purple-500/25">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  Service Tags
                </span>
                <Badge className="ml-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {currentService.tags.length}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              >
                {currentService.tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge className="group px-6 py-3 text-base font-semibold bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/40 dark:via-pink-900/30 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-400/20 transition-all duration-300 rounded-2xl backdrop-blur-sm hover:border-purple-300 dark:hover:border-purple-600 cursor-pointer">
                      <span className="group-hover:scale-110 transition-transform duration-200 inline-block">
                        {tag}
                      </span>
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              {/* Add some visual context */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 dark:text-gray-400 text-sm mt-6 flex items-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Tags help categorize and filter services for better organization
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
