// src/components/admin/ServicesGrid.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  Image as ImageIcon,
} from "lucide-react";

interface ServiceImage {
  url: string;
  serviceName: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  popular: boolean;
  tags?: string[];
  serviceImage?: ServiceImage;
}

interface ServicesGridProps {
  services: Service[];
  viewMode: "grid" | "list";
  isLoading: boolean;
  // Made these props optional with default implementations
  onEditService?: (serviceId: string) => void;
  onDeleteService?: (serviceId: string) => Promise<void>;
  onToggleActive?: (serviceId: string) => Promise<void>;
  onTogglePopular?: (serviceId: string) => Promise<void>;
  onCreateService?: () => void;
  categoryId?: string; // Added for navigation purposes
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  viewMode,
  isLoading,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (services.length === 0) {
    return (
      <Card className="text-center py-16 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent>
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
            No services found
          </h3>
          
        </CardContent>
      </Card>
    );
  }


  // Grid view component
  const GridView: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service) => (
        <Card
          key={service._id}
          className="group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-700">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge
                    variant={service.isActive ? "default" : "secondary"}
                    className={
                      service.isActive
                        ? "bg-green-500 dark:bg-green-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {service.popular && (
                    <Badge
                      variant="outline"
                      className="border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-slate-900 dark:text-slate-100 line-clamp-2">
                  {service.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {service.serviceImage?.url && (
              <div className="mb-4 overflow-hidden rounded-lg">
                <Image
                  src={service.serviceImage.url}
                  alt={service.serviceImage.serviceName || service.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
              {service.description}
            </p>

            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {service.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                    {tag}
                  </Badge>
                ))}
                {service.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                    +{service.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // List view component
  const ListView: React.FC = () => (
    <div className="space-y-4">
      {services.map((service) => (
        <Card
          key={service._id}
          className="flex items-center p-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4 w-full">
            {service.serviceImage?.url ? (
              <Image
                src={service.serviceImage.url}
                alt={service.serviceImage.serviceName || service.title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold truncate text-slate-900 dark:text-slate-100">
                  {service.title}
                </h3>
                <Badge
                  variant={service.isActive ? "default" : "secondary"}
                  className={`${
                    service.isActive
                      ? "bg-green-500 dark:bg-green-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  } flex-shrink-0`}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
                {service.popular && (
                  <Badge
                    variant="outline"
                    className="border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {service.description}
              </p>

              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {service.tags.slice(0, 4).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                  {service.tags.length > 4 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                      +{service.tags.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {viewMode === "grid" ? <GridView /> : <ListView />}
    </div>
  );
};

export default ServicesGrid;
