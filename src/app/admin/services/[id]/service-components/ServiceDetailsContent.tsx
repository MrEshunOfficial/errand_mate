// src/app/admin/services/[id]/components/ServiceDetailContent.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DollarSign, Tag, Info } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  icon?: string;
  tags?: string[];
  pricing?: {
    basePrice?: number;
    currency?: string;
  };
}

interface ServiceDetailContentProps {
  currentService: Service;
  imageLoaded: boolean;
  onImageLoad: () => void;
}

const scaleVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function ServiceDetailContent({
  currentService,
  imageLoaded,
  onImageLoad,
}: ServiceDetailContentProps) {
  return (
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
                  onLoad={onImageLoad}
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
  );
}
