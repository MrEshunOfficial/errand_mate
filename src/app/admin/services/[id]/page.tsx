// src/app/admin/services/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  DollarSign,
  Star,
  Tag,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const {
    currentService,
    loading,
    error,
    loadService,
    removeService,
    toggleStatus,
    clearService,
    resetErrors,
  } = useServices();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService(serviceId, true); // Load with category details
    }

    // Cleanup on unmount
    return () => {
      clearService();
      resetErrors();
    };
  }, [serviceId, loadService, clearService, resetErrors]);

  const handleDelete = async () => {
    if (!currentService) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentService.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      setIsDeleting(true);
      try {
        await removeService(currentService.id);
        router.push("/admin/services");
      } catch (error) {
        console.error("Failed to delete service:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!currentService) return;

    setIsToggling(true);
    try {
      await toggleStatus(currentService.id);
    } catch (error) {
      console.error("Failed to toggle service status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/services/${serviceId}/edit`);
  };

  const handleBack = () => {
    router.push("/admin/services");
  };

  if (loading.currentService) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error.currentService) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error.currentService}</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Service not found.</AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{currentService.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant={currentService.isActive ? "default" : "secondary"}
              >
                {currentService.isActive ? "Active" : "Inactive"}
              </Badge>
              {currentService.popular && (
                <Badge variant="outline" className="text-yellow-600">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={isToggling}
          >
            {currentService.isActive ? (
              <ToggleRight className="w-4 h-4 mr-2" />
            ) : (
              <ToggleLeft className="w-4 h-4 mr-2" />
            )}
            {isToggling
              ? "Updating..."
              : currentService.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Image */}
          {currentService.icon && (
            <Card>
              <CardContent className="p-0">
                <img
                  src={currentService.icon}
                  alt={currentService.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                {currentService.description || "No description available."}
              </p>
              {currentService.longDescription && (
                <div>
                  <h4 className="font-semibold mb-2">Detailed Description</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {currentService.longDescription}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {currentService.tags?.length && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentService.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">
                    {currentService.pricing.basePrice}{" "}
                    {currentService.pricing.currency}
                  </span>
                </div>

                {currentService.pricing.percentageCharge && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>
                      Service Fee: {currentService.pricing.percentageCharge}%
                    </span>
                  </div>
                )}

                {currentService.pricing.additionalFees?.length && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Additional Fees</h4>
                    {currentService.pricing.additionalFees.map((fee, index) => (
                      <div key={index} className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>{fee.name}</span>
                          <span>
                            {fee.amount} {currentService.pricing.currency}
                          </span>
                        </div>
                        {fee.description && (
                          <p className="text-gray-600 text-xs">
                            {fee.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentService.pricing.pricingNotes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Pricing Notes:</strong>{" "}
                    {currentService.pricing.pricingNotes}
                  </div>
                )}
              </div>

              <Separator />

              {/* Category
              {currentService.category && (
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <div className="flex items-center space-x-2">
                    {currentService.category.icon && (
                      <img
                        src={currentService.category.icon}
                        alt={currentService.category.name}
                        className="w-5 h-5"
                      />
                    )}
                    <Badge variant="outline">
                      {currentService.category.name}
                    </Badge>
                  </div>
                </div>
              )} */}

              {/* Locations */}
              {currentService.locations?.length && (
                <div>
                  <h4 className="font-semibold mb-2">Available Locations</h4>
                  <div className="space-y-1">
                    {currentService.locations.map((location, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-sm">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-mono">{currentService.id}</span>
              </div>
              {currentService.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>
                    {new Date(currentService.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {currentService.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated:</span>
                  <span>
                    {new Date(currentService.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
