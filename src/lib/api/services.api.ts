// src/lib/api/services.api.ts

import {
  ServiceFilters,
  PaginatedResponse,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
} from "@/store/type/service-categories";
import { ApiResponse } from "./categories.api";
import apiClient from "./client";

export interface GetServicesParams extends ServiceFilters {
  page?: number;
  limit?: number;
}

export class ServicesApi {
  static async getServices(
    params: GetServicesParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Service>>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());
    if (params.popular !== undefined)
      queryParams.append("popular", params.popular.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.priceRange) {
      queryParams.append("minPrice", params.priceRange.min.toString());
      queryParams.append("maxPrice", params.priceRange.max.toString());
    }

    const url = `/services${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    try {
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Service>>
      >(url);

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to fetch services",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async getServiceById(
    id: string,
    withCategory = false
  ): Promise<ApiResponse<Service>> {
    const url = `/services/${id}${withCategory ? "?withCategory=true" : ""}`;

    try {
      const response = await apiClient.get<ApiResponse<Service>>(url);

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Service not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async getServicesByCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Service>>> {
    return this.getServices({ categoryId, isActive: true, page, limit });
  }

  static async getPopularServices(limit = 10): Promise<ApiResponse<Service[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Service[]>>(
        `/services/popular?limit=${limit}`
      );

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to fetch popular services",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async searchServices(
    query: string,
    limit = 20
  ): Promise<ApiResponse<Service[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Service[]>>(
        `/services/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to search services",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async createService(
    data: CreateServiceInput
  ): Promise<ApiResponse<Service>> {
    try {
      const response = await apiClient.post<ApiResponse<Service>>(
        "/services",
        data
      );

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to create service",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async updateService(
    data: UpdateServiceInput
  ): Promise<ApiResponse<Service>> {
    const { id, ...updateData } = data;

    // Add validation to ensure id exists
    if (!id) {
      return {
        success: false,
        error: "Service ID is required for update",
      };
    }

    try {
      const response = await apiClient.put<ApiResponse<Service>>(
        `/services/${id}`,
        updateData
      );

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to update service",
        };
      }
    } catch (error) {
      console.error("Update service error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async deleteService(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    // Add validation to ensure id exists
    if (!id) {
      return {
        success: false,
        error: "Service ID is required for deletion",
      };
    }

    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        `/services/${id}`
      );

      if (response.data.success) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to delete service",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  static async toggleServiceStatus(id: string): Promise<ApiResponse<Service>> {
    // Add validation to ensure id exists
    if (!id) {
      return {
        success: false,
        error: "Service ID is required to toggle status",
      };
    }

    try {
      const response = await apiClient.patch<ApiResponse<Service>>(
        `/services/${id}/toggle-status`
      );

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to toggle service status",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }
}
