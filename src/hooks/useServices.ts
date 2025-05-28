// src/hooks/useServices.ts
import { useCallback } from "react";

import { GetServicesParams } from "../lib/api/services.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchServices,
  fetchServiceById,
  fetchPopularServices,
  searchServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  setFilters,
  clearFilters,
  clearCurrentService,
  clearSearchResults,
  clearErrors,
} from "@/store/slices/service-slice";
import {
  CreateServiceInput,
  UpdateServiceInput,
  ServiceFilters,
} from "@/store/type/service-categories";

export const useServices = () => {
  const dispatch = useAppDispatch();
  const {
    services,
    currentService,
    popularServices,
    searchResults,
    pagination,
    filters,
    loading,
    error,
  } = useAppSelector((state) => state.services);

  // Fetch services with filters and pagination
  const loadServices = useCallback(
    (params: GetServicesParams = {}) => {
      dispatch(fetchServices(params));
    },
    [dispatch]
  );

  // Fetch single service
  const loadService = useCallback(
    (id: string, withCategory = false) => {
      dispatch(fetchServiceById({ id, withCategory }));
    },
    [dispatch]
  );

  // Fetch popular services
  const loadPopularServices = useCallback(
    (limit = 10) => {
      dispatch(fetchPopularServices(limit));
    },
    [dispatch]
  );

  // Search services
  const searchForServices = useCallback(
    (query: string, limit = 20) => {
      dispatch(searchServices({ query, limit }));
    },
    [dispatch]
  );

  // Create new service - Fixed to handle AsyncThunk properly
  const createNewService = useCallback(
    async (data: CreateServiceInput) => {
      const result = await dispatch(createService(data));
      return result; // Return the full result for proper type checking
    },
    [dispatch]
  );

  // Update existing service - Fixed to handle AsyncThunk properly
  const updateExistingService = useCallback(
    async (data: UpdateServiceInput) => {
      const result = await dispatch(updateService(data));
      return result;
    },
    [dispatch]
  );

  // Delete service - Fixed to handle AsyncThunk properly
  const removeService = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteService(id));
      return result;
    },
    [dispatch]
  );

  // Toggle service status - Fixed to handle AsyncThunk properly
  const toggleStatus = useCallback(
    async (id: string) => {
      const result = await dispatch(toggleServiceStatus(id));
      return result;
    },
    [dispatch]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: ServiceFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  // Clear all filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Clear current service
  const clearService = useCallback(() => {
    dispatch(clearCurrentService());
  }, [dispatch]);

  // Clear search results
  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  // Clear all errors
  const resetErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Pagination helpers
  const goToPage = useCallback(
    (page: number) => {
      loadServices({ ...filters, page });
    },
    [loadServices, filters]
  );

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      goToPage(pagination.page + 1);
    }
  }, [pagination, goToPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      goToPage(pagination.page - 1);
    }
  }, [pagination, goToPage]);

  return {
    // State
    services,
    currentService,
    popularServices,
    searchResults,
    pagination,
    filters,
    loading,
    error,

    // Actions
    loadServices,
    loadService,
    loadPopularServices,
    searchForServices,
    createNewService,
    updateExistingService,
    removeService,
    toggleStatus,
    updateFilters,
    resetFilters,
    clearService,
    clearSearch,
    resetErrors,

    // Pagination
    goToPage,
    nextPage,
    prevPage,
  };
};
