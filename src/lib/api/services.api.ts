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
    if (params.locations?.length)
      queryParams.append("locations", params.locations.join(","));
    if (params.search) queryParams.append("search", params.search);
    if (params.priceRange) {
      queryParams.append("minPrice", params.priceRange.min.toString());
      queryParams.append("maxPrice", params.priceRange.max.toString());
    }

    const url = `/services${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<PaginatedResponse<Service>>(url);
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async getServiceById(
    id: string,
    withCategory = false
  ): Promise<ApiResponse<Service>> {
    const url = `/services/${id}${withCategory ? "?withCategory=true" : ""}`;
    const response = await apiClient.get<Service>(url);
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async getServicesByCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Service>>> {
    return this.getServices({ categoryId, isActive: true, page, limit });
  }

  static async getPopularServices(limit = 10): Promise<ApiResponse<Service[]>> {
    const response = await apiClient.get<Service[]>(
      `/services/popular?limit=${limit}`
    );
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async searchServices(
    query: string,
    limit = 20
  ): Promise<ApiResponse<Service[]>> {
    const response = await apiClient.get<Service[]>(
      `/services/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async createService(
    data: CreateServiceInput
  ): Promise<ApiResponse<Service>> {
    const response = await apiClient.post<Service>("/services", data);
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async updateService(
    data: UpdateServiceInput
  ): Promise<ApiResponse<Service>> {
    const { id, ...updateData } = data;
    const response = await apiClient.put<Service>(
      `/services/${id}`,
      updateData
    );
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async deleteService(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<{ message: string }>(
      `/services/${id}`
    );
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async toggleServiceStatus(id: string): Promise<ApiResponse<Service>> {
    const response = await apiClient.patch<Service>(
      `/services/${id}/toggle-status`
    );
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
      error:
        response.status >= 200 && response.status < 300
          ? undefined
          : response.statusText,
    };
  }

  static async getServicesByLocation(
    location: string
  ): Promise<ApiResponse<Service[]>> {
    return this.getServices({ locations: [location], isActive: true }).then(
      (response) => ({
        ...response,
        data: response.data?.data || [],
      })
    );
  }
}
