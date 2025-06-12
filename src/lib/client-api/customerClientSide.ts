// src/api/clientApi.ts

import { CreateClientInput, ClientData, UpdateClientInput, ClientServiceRequest, ServiceRating, ClientDataWithServices } from '@/store/type/client_provider_Data';
import { Types } from 'mongoose';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
  error?: string;
}

// Client API endpoints
const ENDPOINTS = {
  CLIENTS: '/clients',
  CLIENT_BY_ID: (id: string) => `/clients/${id}`,
  CLIENT_BY_USER_ID: (userId: string) => `/clients/me/${userId}`,
  CLIENT_BY_EMAIL: (email: string) => `/clients/email/${encodeURIComponent(email)}`,
  CLIENT_SERVICE_REQUESTS: (clientId: string) => `/clients/${clientId}/service-requests`,
  CLIENT_SERVICE_REQUEST_STATUS: (clientId: string, requestId: string) => 
    `/clients/${clientId}/service-requests/${requestId}/status`,
  CLIENT_RATINGS: (clientId: string) => `/clients/${clientId}/ratings`,
  CLIENT_STATS: (clientId: string) => `/clients/${clientId}/stats`,
  CLIENT_SEARCH_LOCATION: '/clients/search/location',
  CLIENT_EXISTS: '/clients/exists'
} as const;

// HTTP utility functions
class HttpClient {
  private static async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  static async post<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  static async put<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  static async patch<T>(url: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  static async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', headers });
  }
}

// Client API service class
export class ClientApiService {
  
  /**
   * Create a new client
   */
  static async createClient(clientData: CreateClientInput): Promise<ApiResponse<ClientData>> {
    try {
      const response = await HttpClient.post<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENTS,
        clientData
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create client'
      };
    }
  }

  /**
   * Get client by ID
   */
  static async getClientById(clientId: string): Promise<ApiResponse<ClientData>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const response = await HttpClient.get<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_BY_ID(clientId)
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get client'
      };
    }
  }

  /**
   * Get client by user ID
   */
  static async getClientByUserId(userId: string): Promise<ApiResponse<ClientData>> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await HttpClient.get<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_BY_USER_ID(userId)
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get client by user ID'
      };
    }
  }

  /**
   * Get client by email
   */
  static async getClientByEmail(email: string): Promise<ApiResponse<ClientData>> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await HttpClient.get<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_BY_EMAIL(email)
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get client by email'
      };
    }
  }

  /**
   * Update client information
   */
  static async updateClient(
    clientId: string, 
    updateData: Partial<UpdateClientInput>
  ): Promise<ApiResponse<ClientData>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required');
      }

      const response = await HttpClient.put<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_BY_ID(clientId),
        updateData
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update client'
      };
    }
  }

  /**
   * Delete client
   */
  static async deleteClient(clientId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const response = await HttpClient.delete<ApiResponse<{ deleted: boolean }>>( 
        ENDPOINTS.CLIENT_BY_ID(clientId)
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete client'
      };
    }
  }

  /**
   * Get all clients with pagination and filtering
   */
  static async getAllClients(options: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    city?: string;
    district?: string;
  } = {}): Promise<PaginatedResponse<ClientData>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = queryParams.toString() 
        ? `${ENDPOINTS.CLIENTS}?${queryParams.toString()}`
        : ENDPOINTS.CLIENTS;

      const response = await HttpClient.get<PaginatedResponse<ClientData>>(url);
      return response;
    } catch (error) {
      return {
        success: false,
        data: {
          items: [],
          total: 0,
          page: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        error: error instanceof Error ? error.message : 'Failed to get clients'
      };
    }
  }

  /**
   * Add service request to client history
   */
  static async addServiceRequest(
    clientId: string,
    serviceRequest: Omit<ClientServiceRequest, 'requestId' | 'date'>
  ): Promise<ApiResponse<ClientData>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      if (!serviceRequest || !serviceRequest.serviceId) {
        throw new Error('Service request data is required');
      }

      const response = await HttpClient.post<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_SERVICE_REQUESTS(clientId),
        serviceRequest
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add service request'
      };
    }
  }

  /**
   * Update service request status
   */
  static async updateServiceRequestStatus(
    clientId: string,
    requestId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ): Promise<ApiResponse<ClientData>> {
    try {
      if (!clientId || !requestId) {
        throw new Error('Client ID and Request ID are required');
      }

      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status provided');
      }

      const response = await HttpClient.patch<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_SERVICE_REQUEST_STATUS(clientId, requestId),
        { status }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update service request status'
      };
    }
  }

  /**
   * Get client service request history
   */
  static async getServiceRequestHistory(
    clientId: string,
    options: {
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<{ requests: ClientServiceRequest[]; total: number }>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = queryParams.toString()
        ? `${ENDPOINTS.CLIENT_SERVICE_REQUESTS(clientId)}?${queryParams.toString()}`
        : ENDPOINTS.CLIENT_SERVICE_REQUESTS(clientId);

      const response = await HttpClient.get<ApiResponse<{ requests: ClientServiceRequest[]; total: number }>>(url);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get service request history'
      };
    }
  }

  /**
   * Add service provider rating
   */
  static async addServiceProviderRating(
    clientId: string,
    rating: Omit<ServiceRating & { providerId: Types.ObjectId }, 'date'>
  ): Promise<ApiResponse<ClientData>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      if (!rating || typeof rating.rating !== 'number' || rating.rating < 1 || rating.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      if (!rating.review) {
        throw new Error('Review is required');
      }

      const response = await HttpClient.post<ApiResponse<ClientData>>(
        ENDPOINTS.CLIENT_RATINGS(clientId),
        rating
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add service provider rating'
      };
    }
  }

  /**
   * Get client statistics
   */
  static async getClientStats(clientId: string): Promise<ApiResponse<{
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatingsGiven: number;
  }>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const response = await HttpClient.get<ApiResponse<{
        totalRequests: number;
        completedRequests: number;
        pendingRequests: number;
        cancelledRequests: number;
        averageRating: number;
        totalRatingsGiven: number;
      }>>(ENDPOINTS.CLIENT_STATS(clientId));
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get client statistics'
      };
    }
  }

  /**
   * Search clients by location
   */
  static async searchClientsByLocation(
    region?: string,
    city?: string,
    district?: string,
    locality?: string
  ): Promise<ApiResponse<ClientData[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (region) queryParams.append('region', region);
      if (city) queryParams.append('city', city);
      if (district) queryParams.append('district', district);
      if (locality) queryParams.append('locality', locality);

      const url = queryParams.toString()
        ? `${ENDPOINTS.CLIENT_SEARCH_LOCATION}?${queryParams.toString()}`
        : ENDPOINTS.CLIENT_SEARCH_LOCATION;

      const response = await HttpClient.get<ApiResponse<ClientData[]>>(url);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search clients by location'
      };
    }
  }

  /**
   * Check if client exists by userId or email
   */
  static async checkClientExists(
    userId?: string, 
    email?: string
  ): Promise<ApiResponse<{ exists: boolean }>> {
    try {
      if (!userId && !email) {
        throw new Error('Either userId or email must be provided');
      }

      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('userId', userId);
      if (email) queryParams.append('email', email);

      const response = await HttpClient.get<ApiResponse<{ exists: boolean }>>(
        `${ENDPOINTS.CLIENT_EXISTS}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check client existence'
      };
    }
  }

  /**
   * Batch operations utility
   */
  static async batchUpdateClients(
    updates: Array<{ clientId: string; updateData: Partial<UpdateClientInput> }>
  ): Promise<ApiResponse<{ successful: string[]; failed: Array<{ clientId: string; error: string }> }>> {
    try {
      const results = await Promise.allSettled(
        updates.map(({ clientId, updateData }) => 
          this.updateClient(clientId, updateData)
        )
      );

      const successful: string[] = [];
      const failed: Array<{ clientId: string; error: string }> = [];

      results.forEach((result, index) => {
        const { clientId } = updates[index];
        if (result.status === 'fulfilled' && result.value.success) {
          successful.push(clientId);
        } else {
          failed.push({
            clientId,
            error: result.status === 'rejected' 
              ? result.reason.message 
              : result.value.error || 'Unknown error'
          });
        }
      });

      return {
        success: true,
        data: { successful, failed }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Batch update failed'
      };
    }
  }

  /**
   * Get client with populated service data
   */
  static async getClientWithServices(clientId: string): Promise<ApiResponse<ClientDataWithServices>> {
    try {
      if (!clientId) {
        throw new Error('Client ID is required');
      }

      const response = await HttpClient.get<ApiResponse<ClientDataWithServices>>(
        `${ENDPOINTS.CLIENT_BY_ID(clientId)}/with-services`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get client with services'
      };
    }
  }
}

// Export additional utilities for Redux integration
export const clientApiUtils = {
  // Cache key generators for React Query or SWR
  getCacheKey: {
    client: (id: string) => ['client', id],
    clientByUserId: (userId: string) => ['client', 'userId', userId],
    clientByEmail: (email: string) => ['client', 'email', email],
    clients: (filters?: unknown) => ['clients', filters],
    serviceRequests: (clientId: string, filters?: unknown) => ['client', clientId, 'serviceRequests', filters],
    clientStats: (clientId: string) => ['client', clientId, 'stats'],
    locationSearch: (location: unknown) => ['clients', 'location', location]
  },

  // Validation helpers
  validateClientData: (data: Partial<CreateClientInput>): string[] => {
    const errors: string[] = [];
    
    if (!data.userId) errors.push('User ID is required');
    if (!data.fullName) errors.push('Full name is required');
    if (!data.contactDetails?.email) errors.push('Email is required');
    if (!data.contactDetails?.primaryContact) errors.push('Primary contact is required');
    if (!data.location?.region) errors.push('Region is required');
    if (!data.profilePicture?.url) errors.push('Profile picture is required');
    
    return errors;
  },

  // Data transformation helpers
  transformClientForDisplay: (client: ClientData) => ({
    ...client,
    displayName: client.fullName,
    primaryContact: client.contactDetails.primaryContact,
    email: client.contactDetails.email,
    fullAddress: `${client.location.locality}, ${client.location.district}, ${client.location.city}, ${client.location.region}`,
    totalRequests: client.serviceRequestHistory?.length || 0,
    completedRequests: client.serviceRequestHistory?.filter(req => req.status === 'completed').length || 0
  })
};

export default ClientApiService;