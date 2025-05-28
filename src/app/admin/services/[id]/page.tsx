// src/app/admin/services/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";
import { ServiceDetailView } from "./service-components/ServiceDetailsView";

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

  // Local state for UI interactions
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load service on mount and cleanup on unmount
  useEffect(() => {
    if (serviceId) {
      loadService(serviceId, true);
    }

    return () => {
      clearService();
      resetErrors();
    };
  }, [serviceId, loadService, clearService, resetErrors]);

  // Event handlers
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Prepare props for the UI component
  const viewProps = {
    // Data
    currentService: currentService
      ? {
          ...currentService,
          // More robust date handling
          createdAt:
            currentService.createdAt instanceof Date
              ? currentService.createdAt.toISOString()
              : typeof currentService.createdAt === "string"
              ? currentService.createdAt
              : new Date().toISOString(),
          updatedAt:
            currentService.updatedAt instanceof Date
              ? currentService.updatedAt.toISOString()
              : typeof currentService.updatedAt === "string"
              ? currentService.updatedAt
              : new Date().toISOString(),
        }
      : null,
    serviceId,

    // Loading states
    isLoading: loading.currentService || loading.services, // Check both loading states
    isDeleting,
    isToggling,
    imageLoaded,

    // Error states
    error: error.currentService || error.services, // Check both error states

    // Event handlers
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    onEdit: handleEdit,
    onBack: handleBack,
    onImageLoad: handleImageLoad,
  };

  return <ServiceDetailView {...viewProps} />;
}
