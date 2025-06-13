// src/api/providerClientApi.ts

import { 
  CreateClientInput, 
  ClientData, 
  ClientDataWithServices, 
  UpdateClientInput, 
  ClientServiceRequest, 
  ServiceRating,
  CreateProviderInput,
  ServiceProviderData,
  ProviderDataWithServices,
  UpdateProviderInput,
  WitnessDetails
} from "@/store/type/client_provider_Data";

// Base API configuration
const API_BASE_URL = '/api';

// Generic API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Provider-specific interfaces for API operations
export type CreateProviderRequest = CreateProviderInput
export type UpdateProviderRequest = Partial<UpdateProviderInput>

export interface ProviderRatingRequest {
  rating: number;
  review: string;
  serviceId: string;
  clientId: string;
  requestId: string;
}

export interface AddProviderRatingRequest {
  rating: number;
  review: string;
  serviceId: string;
}

export interface ServiceRequestInput {
  serviceId: string;
  clientId: string;
  requestNumber: string;
  notes?: string;
}

// HTTP client utility class
class HttpClient {
  private static async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message,
        statusCode: response.status,
      };
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
        statusCode: 0,
      };
    }
  }

  static async get<T>(url: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.makeRequest<T>(`${url}${searchParams}`, {
      method: 'GET',
    });
  }

  static async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'DELETE',
    });
  }
}

// Client API service class
export class ClientApiService {
  
  /**
   * Create a new client
   */
  static async createClient(clientData: CreateClientInput): Promise<ApiResponse<ClientData>> {
    return HttpClient.post<ClientData>('/clients', clientData);
  }

  /**
   * Get client by ID
   */
  static async getClientById(clientId: string): Promise<ApiResponse<ClientData>> {
    return HttpClient.get<ClientData>(`/clients/${clientId}`);
  }

  /**
   * Get client by user ID
   */
  static async getClientByUserId(userId: string): Promise<ApiResponse<ClientData>> {
    return HttpClient.get<ClientData>(`/clients/user/${userId}`);
  }

  /**
   * Get client by user ID with populated services
   */
  static async getClientWithServices(userId: string): Promise<ApiResponse<ClientDataWithServices>> {
    return HttpClient.get<ClientDataWithServices>(`/clients/user/${userId}/with-services`);
  }

  /**
   * Update client information
   */
  static async updateClient(
    clientId: string, 
    updateData: Partial<UpdateClientInput>
  ): Promise<ApiResponse<ClientData>> {
    return HttpClient.put<ClientData>(`/clients/${clientId}`, updateData);
  }

  /**
   * Delete client
   */
  static async deleteClient(clientId: string): Promise<ApiResponse<{ message: string }>> {
    return HttpClient.delete<{ message: string }>(`/clients/${clientId}`);
  }

  /**
   * Get all clients with pagination and filters
   */
  static async getAllClients(options: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    city?: string;
    district?: string;
  } = {}): Promise<ApiResponse<{ 
    clients: ClientData[]; 
    total: number; 
    currentPage: number; 
    totalPages: number; 
  }>> {
    const params: Record<string, string> = {};
    
    if (options.page) params.page = options.page.toString();
    if (options.limit) params.limit = options.limit.toString();
    if (options.search) params.search = options.search;
    if (options.region) params.region = options.region;
    if (options.city) params.city = options.city;
    if (options.district) params.district = options.district;

    return HttpClient.get<{ 
      clients: ClientData[]; 
      total: number; 
      currentPage: number; 
      totalPages: number; 
    }>('/clients', params);
  }

  /**
   * Search clients by query
   */
  static async searchClients(query: string): Promise<ApiResponse<{
    clients: ClientData[];
    total: number;
    query: string;
  }>> {
    return HttpClient.get<{
      clients: ClientData[];
      total: number;
      query: string;
    }>('/clients/search', { q: query });
  }

  /**
   * Get clients by location
   */
  static async getClientsByLocation(
    region?: string,
    city?: string,
    district?: string
  ): Promise<ApiResponse<{
    clients: ClientData[];
    total: number;
    filters: { region?: string; city?: string; district?: string };
  }>> {
    const params: Record<string, string> = {};
    if (region) params.region = region;
    if (city) params.city = city;
    if (district) params.district = district;

    return HttpClient.get<{
      clients: ClientData[];
      total: number;
      filters: { region?: string; city?: string; district?: string };
    }>('/clients/location', params);
  }

  /**
   * Add service request to client
   */
  static async addServiceRequest(
    clientId: string,
    serviceRequest: Omit<ClientServiceRequest, 'requestId' | 'date' | 'status'>
  ): Promise<ApiResponse<ClientData>> {
    return HttpClient.post<ClientData>(`/clients/${clientId}/requests`, serviceRequest);
  }

  /**
   * Update service request status
   */
  static async updateServiceRequestStatus(
    clientId: string,
    requestId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ): Promise<ApiResponse<ClientData>> {
    return HttpClient.put<ClientData>(`/clients/${clientId}/requests/${requestId}`, { status });
  }

  /**
   * Get client's service request history
   */
  static async getServiceRequestHistory(
    clientId: string,
    options: {
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<{ requests: ClientServiceRequest[]; total: number }>> {
    const params: Record<string, string> = {};
    if (options.status) params.status = options.status;
    if (options.page) params.page = options.page.toString();
    if (options.limit) params.limit = options.limit.toString();

    return HttpClient.get<{ requests: ClientServiceRequest[]; total: number }>(
      `/clients/${clientId}/requests`, 
      params
    );
  }

  /**
   * Add service provider rating
   */
  static async addServiceProviderRating(
    clientId: string,
    rating: Omit<ServiceRating, 'date'> & { providerId: string }
  ): Promise<ApiResponse<ClientData>> {
    return HttpClient.post<ClientData>(`/clients/${clientId}/ratings`, rating);
  }

  /**
   * Get client statistics
   */
  static async getClientStats(clientId: string): Promise<ApiResponse<{
    clientId: string;
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatingsGiven: number;
  }>> {
    return HttpClient.get<{
      clientId: string;
      totalRequests: number;
      completedRequests: number;
      pendingRequests: number;
      cancelledRequests: number;
      averageRating: number;
      totalRatingsGiven: number;
    }>(`/clients/${clientId}/stats`);
  }

  /**
   * Check if client exists
   */
  static async checkClientExists(userId?: string, email?: string): Promise<ApiResponse<{
    exists: boolean;
    userId?: string;
    email?: string;
  }>> {
    const params: Record<string, string> = {};
    if (userId) params.userId = userId;
    if (email) params.email = email;

    return HttpClient.get<{
      exists: boolean;
      userId?: string;
      email?: string;
    }>('/clients/check-exists', params);
  }
}

// Provider API service class
export class ProviderApiService {
  
  /**
   * Create a new provider
   */
  static async createProvider(providerData: CreateProviderRequest): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.post<ServiceProviderData>('/providers', providerData);
  }

  /**
   * Get provider by ID
   */
  static async getProviderById(providerId: string): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.get<ServiceProviderData>(`/providers/${providerId}`);
  }

  /**
   * Get provider by user ID
   */
  static async getProviderByUserId(userId: string): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.get<ServiceProviderData>(`/providers/user/${userId}`);
  }

  /**
   * Get provider with services
   */
  static async getProviderWithServices(userId: string): Promise<ApiResponse<ProviderDataWithServices>> {
    return HttpClient.get<ProviderDataWithServices>(`/providers/user/${userId}/with-services`);
  }

  /**
   * Update provider
   */
  static async updateProvider(providerId: string, updateData: UpdateProviderRequest): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.put<ServiceProviderData>(`/providers/${providerId}`, updateData);
  }

  /**
   * Delete provider
   */
  static async deleteProvider(providerId: string): Promise<ApiResponse<{ message: string }>> {
    return HttpClient.delete<{ message: string }>(`/providers/${providerId}`);
  }

  /**
   * Get all providers with pagination and filters
   */
  static async getAllProviders(options: {
    page?: number;
    limit?: number;
    region?: string;
    city?: string;
    serviceId?: string;
    minRating?: number;
    search?: string;
  } = {}): Promise<ApiResponse<{
    providers: ServiceProviderData[];
    totalProviders: number;
    currentPage: number;
    totalPages: number;
  }>> {
    const params: Record<string, string> = {};
    
    if (options.page) params.page = options.page.toString();
    if (options.limit) params.limit = options.limit.toString();
    if (options.region) params.region = options.region;
    if (options.city) params.city = options.city;
    if (options.serviceId) params.serviceId = options.serviceId;
    if (options.minRating) params.minRating = options.minRating.toString();
    if (options.search) params.search = options.search;

    return HttpClient.get<{
      providers: ServiceProviderData[];
      totalProviders: number;
      currentPage: number;
      totalPages: number;
    }>('/providers', params);
  }

  /**
   * Search providers
   */
  static async searchProviders(query: string): Promise<ApiResponse<{
    providers: ServiceProviderData[];
    total: number;
    query: string;
  }>> {
    return HttpClient.get<{
      providers: ServiceProviderData[];
      total: number;
      query: string;
    }>('/providers/search', { q: query });
  }

  /**
   * Get providers by service
   */
  static async getProvidersByService(serviceId: string): Promise<ApiResponse<{
    providers: ServiceProviderData[];
    total: number;
    serviceId: string;
  }>> {
    return HttpClient.get<{
      providers: ServiceProviderData[];
      total: number;
      serviceId: string;
    }>(`/providers/services/${serviceId}`);
  }

  /**
   * Get providers by location
   */
  static async getProvidersByLocation(
    region?: string,
    city?: string,
    district?: string
  ): Promise<ApiResponse<{
    providers: ServiceProviderData[];
    total: number;
    filters: { region?: string; city?: string; district?: string };
  }>> {
    const params: Record<string, string> = {};
    if (region) params.region = region;
    if (city) params.city = city;
    if (district) params.district = district;

    return HttpClient.get<{
      providers: ServiceProviderData[];
      total: number;
      filters: { region?: string; city?: string; district?: string };
    }>('/providers/location', params);
  }

  /**
   * Add service request to provider
   */
  static async addServiceRequest(
    providerId: string,
    serviceRequest: ServiceRequestInput
  ): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.post<ServiceProviderData>(`/providers/${providerId}/requests`, serviceRequest);
  }

  /**
   * Update service request status
   */
  static async updateServiceRequestStatus(
    providerId: string,
    requestId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.put<ServiceProviderData>(`/providers/${providerId}/requests/${requestId}`, { status });
  }

  /**
   * Add client rating to provider
   */
  static async addClientRating(
    providerId: string,
    rating: AddProviderRatingRequest
  ): Promise<ApiResponse<{
    provider: ServiceProviderData;
    averageRating: number;
  }>> {
    return HttpClient.post<{
      provider: ServiceProviderData;
      averageRating: number;
    }>(`/providers/${providerId}/ratings`, rating);
  }

  /**
   * Get provider's average rating
   */
  static async getProviderRating(providerId: string): Promise<ApiResponse<{
    providerId: string;
    averageRating: number;
    totalRatings: number;
  }>> {
    return HttpClient.get<{
      providerId: string;
      averageRating: number;
      totalRatings: number;
    }>(`/providers/${providerId}/ratings`);
  }

  /**
   * Get provider statistics
   */
  static async getProviderStats(providerId: string): Promise<ApiResponse<{
    providerId: string;
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatings: number;
  }>> {
    return HttpClient.get<{
      providerId: string;
      totalRequests: number;
      completedRequests: number;
      pendingRequests: number;
      cancelledRequests: number;
      averageRating: number;
      totalRatings: number;
    }>(`/providers/${providerId}/stats`);
  }

  /**
   * Update witness details
   */
  static async updateWitnessDetails(
    providerId: string,
    witnessDetails: WitnessDetails[]
  ): Promise<ApiResponse<ServiceProviderData>> {
    return HttpClient.put<ServiceProviderData>(`/providers/${providerId}/witness`, witnessDetails);
  }

  /**
   * Get witness details
   */
  static async getWitnessDetails(providerId: string): Promise<ApiResponse<{
    providerId: string;
    witnessDetails: WitnessDetails[];
  }>> {
    return HttpClient.get<{
      providerId: string;
      witnessDetails: WitnessDetails[];
    }>(`/providers/${providerId}/witness`);
  }
}

// Export all services
export { HttpClient };

// Usage examples and error handling utilities
export class ApiErrorHandler {
  static handleError(response: ApiResponse<unknown>): string {
    if (response.success) {
      return '';
    }

    // Handle specific error codes
    switch (response.statusCode) {
      case 401:
        return 'You are not authorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        return response.error || 'An unexpected error occurred.';
    }
  }

  static isNetworkError(response: ApiResponse<unknown>): boolean {
    return response.statusCode === 0;
  }

  static isServerError(response: ApiResponse<unknown>): boolean {
    return (response.statusCode || 0) >= 500;
  }

  static isClientError(response: ApiResponse<unknown>): boolean {
    const code = response.statusCode || 0;
    return code >= 400 && code < 500;
  }
}

// Retry mechanism for failed requests
export class ApiRetryHandler {
  static async withRetry<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<ApiResponse<T>> {
    let lastResponse: ApiResponse<T>;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      lastResponse = await apiCall();
      
      if (lastResponse.success || !this.shouldRetry(lastResponse)) {
        return lastResponse;
      }
      
      if (attempt < maxRetries) {
        await this.delay(delayMs * attempt);
      }
    }
    
    return lastResponse!;
  }

  private static shouldRetry(response: ApiResponse<unknown>): boolean {
    // Retry on network errors or server errors (5xx)
    return ApiErrorHandler.isNetworkError(response) || ApiErrorHandler.isServerError(response);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}