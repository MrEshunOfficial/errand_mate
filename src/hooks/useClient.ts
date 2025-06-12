// src/hooks/useClient.ts
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  // Async thunks
  createClient,
  fetchClientById,
  fetchClientByUserId,
  fetchClientByEmail,
  updateClient,
  deleteClient,
  fetchAllClients,
  addServiceRequest,
  updateServiceRequestStatus,
  fetchServiceRequestHistory,
  addServiceProviderRating,
  fetchClientStats,
  searchClientsByLocation,
  checkClientExists,
  batchUpdateClients,
  fetchClientWithServices,

  // Action creators
  setSelectedClient,
  toggleClientForm,
  toggleServiceRequestForm,
  toggleRatingForm,
  setFilters,
  clearFilters,
  clearCurrentClient,
  clearErrors,
  clearSearchResults,
  resetClientState,
  updateClientLocal,
  addServiceRequestLocal,
  updateServiceRequestLocal,

  // Selectors
  selectCurrentClient,
  selectClientWithServices,
  selectClients,
  selectClientsPagination,
  selectServiceRequests,
  selectClientStats,
  selectSearchResults,
  selectFilters,
  selectClientLoading,
  selectClientErrors,
  selectSelectedClientId,
  selectIsClientFormOpen,
  selectIsServiceRequestFormOpen,
  selectIsRatingFormOpen,
  selectClientById,
  selectCompletedServiceRequests,
  selectPendingServiceRequests,
  selectClientsByLocation,
  ClientState,
} from "@/store/slices/clientSlice";
import {
  ClientData,
  CreateClientInput,
  UpdateClientInput,
  ClientServiceRequest,
  ServiceRating,
  ClientDataWithServices,
} from "@/store/type/client_provider_Data";
import { Types } from "mongoose";

export interface UseClientReturn {
  // State
  currentClient: ClientData | null;
  clientWithServices: ClientDataWithServices | null;
  clients: ClientData[];
  pagination: ClientState["pagination"];
  serviceRequests: ClientServiceRequest[];
  serviceRequestsPagination: ClientState["serviceRequestsPagination"];
  stats: ClientState["stats"];
  searchResults: ClientData[];
  filters: ClientState["filters"];
  loading: ClientState["loading"];
  errors: ClientState["errors"];
  selectedClientId: string | null;
  isClientFormOpen: boolean;
  isServiceRequestFormOpen: boolean;
  isRatingFormOpen: boolean;

  // Computed values
  completedServiceRequests: ClientServiceRequest[];
  pendingServiceRequests: ClientServiceRequest[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading: boolean;
  hasErrors: boolean;

  // Client operations
  createNewClient: (clientData: CreateClientInput) => Promise<void>;
  getClientById: (clientId: string) => Promise<void>;
  getClientByUserId: (userId: string) => Promise<ClientData | undefined>;
  getClientByEmail: (email: string) => Promise<void>;
  updateExistingClient: (
    clientId: string,
    updateData: Partial<UpdateClientInput>
  ) => Promise<void>;
  removeClient: (clientId: string) => Promise<void>;
  getAllClients: (options?: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    city?: string;
    district?: string;
  }) => Promise<void>;
  getClientWithServices: (clientId: string) => Promise<void>;

  // Service request operations
  createServiceRequest: (
    clientId: string,
    serviceRequest: Omit<ClientServiceRequest, "requestId" | "date">
  ) => Promise<void>;
  updateServiceStatus: (
    clientId: string,
    requestId: string,
    status: "pending" | "in-progress" | "completed" | "cancelled"
  ) => Promise<void>;
  getServiceRequestHistory: (
    clientId: string,
    options?: { status?: string; page?: number; limit?: number }
  ) => Promise<void>;

  // Rating operations
  addProviderRating: (
    clientId: string,
    rating: Omit<ServiceRating & { providerId: Types.ObjectId }, "date">
  ) => Promise<void>;

  // Utility operations
  getClientStats: (clientId: string) => Promise<void>;
  searchByLocation: (location: {
    region?: string;
    city?: string;
    district?: string;
    locality?: string;
  }) => Promise<void>;
  verifyClientExists: (params: {
    userId?: string;
    email?: string;
  }) => Promise<void>;
  batchUpdate: (
    updates: Array<{ clientId: string; updateData: Partial<UpdateClientInput> }>
  ) => Promise<void>;

  // UI actions
  selectClient: (clientId: string | null) => void;
  openClientForm: () => void;
  closeClientForm: () => void;
  toggleClientFormState: (open?: boolean) => void;
  openServiceRequestForm: () => void;
  closeServiceRequestForm: () => void;
  toggleServiceRequestFormState: (open?: boolean) => void;
  openRatingForm: () => void;
  closeRatingForm: () => void;
  toggleRatingFormState: (open?: boolean) => void;

  // Filter actions
  updateFilters: (filters: Partial<ClientState["filters"]>) => void;
  resetFilters: () => void;

  // Clear actions
  clearClient: () => void;
  clearAllErrors: () => void;
  clearSearch: () => void;
  resetState: () => void;

  // Local state updates (for optimistic updates)
  updateClientOptimistically: (updates: Partial<ClientData>) => void;
  addServiceRequestOptimistically: (
    serviceRequest: ClientServiceRequest
  ) => void;
  updateServiceRequestOptimistically: (
    requestId: string,
    updates: Partial<ClientServiceRequest>
  ) => void;

  // Helper functions
  getClientByIdSync: (clientId: string) => ClientData | undefined;
  getClientsByLocationSync: (region?: string, city?: string) => ClientData[];
}

export const useClient = (): UseClientReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors with memoization
  const currentClient = useSelector(selectCurrentClient);
  const clientWithServices = useSelector(selectClientWithServices);
  const clients = useSelector(selectClients);
  const pagination = useSelector(selectClientsPagination);
  const serviceRequests = useSelector(selectServiceRequests);
  const stats = useSelector(selectClientStats);
  const searchResults = useSelector(selectSearchResults);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectClientLoading);
  const errors = useSelector(selectClientErrors);
  const selectedClientId = useSelector(selectSelectedClientId);
  const isClientFormOpen = useSelector(selectIsClientFormOpen);
  const isServiceRequestFormOpen = useSelector(selectIsServiceRequestFormOpen);
  const isRatingFormOpen = useSelector(selectIsRatingFormOpen);
  const completedServiceRequests = useSelector(selectCompletedServiceRequests);
  const pendingServiceRequests = useSelector(selectPendingServiceRequests);

  // Service requests pagination
  const serviceRequestsPagination = useSelector(
    (state: { client: ClientState }) => state.client.serviceRequestsPagination
  );

  // Optimized computed values with proper memoization
  const hasNextPage = useMemo(
    () => pagination.hasNextPage,
    [pagination.hasNextPage]
  );
  const hasPrevPage = useMemo(
    () => pagination.hasPrevPage,
    [pagination.hasPrevPage]
  );
  const isLoading = useMemo(
    () => Object.values(loading).some(Boolean),
    [loading]
  );
  const hasErrors = useMemo(
    () => Object.values(errors).some((error) => error !== null),
    [errors]
  );

  // Optimized client operations with better error handling
  const createNewClient = useCallback(
    async (clientData: CreateClientInput): Promise<void> => {
      try {
        await dispatch(createClient(clientData)).unwrap();
      } catch (error) {
        throw error; // Let calling component handle the error
      }
    },
    [dispatch]
  );

  const getClientById = useCallback(
    async (clientId: string): Promise<void> => {
      try {
        await dispatch(fetchClientById(clientId)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

 const getClientByUserId = useCallback(
  async (userId: string): Promise<ClientData | undefined> => {
    try {
      const result = await dispatch(fetchClientByUserId(userId)).unwrap();

      // Convert null to undefined
      return result ?? undefined;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("getClientByUserId failed:", error);
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        return undefined;
      }

      throw error;
    }
  },
  [dispatch]
);

  const getClientByEmail = useCallback(
    async (email: string): Promise<void> => {
      try {
        await dispatch(fetchClientByEmail(email)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const updateExistingClient = useCallback(
    async (
      clientId: string,
      updateData: Partial<UpdateClientInput>
    ): Promise<void> => {
      try {
        await dispatch(updateClient({ clientId, updateData })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const removeClient = useCallback(
    async (clientId: string): Promise<void> => {
      try {
        await dispatch(deleteClient(clientId)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const getAllClients = useCallback(
    async (
      options: {
        page?: number;
        limit?: number;
        search?: string;
        region?: string;
        city?: string;
        district?: string;
      } = {}
    ): Promise<void> => {
      try {
        await dispatch(fetchAllClients(options)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const getClientWithServices = useCallback(
    async (clientId: string): Promise<void> => {
      try {
        await dispatch(fetchClientWithServices(clientId)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  // Service request operations
  const createServiceRequest = useCallback(
    async (
      clientId: string,
      serviceRequest: Omit<ClientServiceRequest, "requestId" | "date">
    ): Promise<void> => {
      try {
        await dispatch(
          addServiceRequest({ clientId, serviceRequest })
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const updateServiceStatus = useCallback(
    async (
      clientId: string,
      requestId: string,
      status: "pending" | "in-progress" | "completed" | "cancelled"
    ): Promise<void> => {
      try {
        await dispatch(
          updateServiceRequestStatus({ clientId, requestId, status })
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const getServiceRequestHistory = useCallback(
    async (
      clientId: string,
      options?: { status?: string; page?: number; limit?: number }
    ): Promise<void> => {
      try {
        await dispatch(
          fetchServiceRequestHistory({ clientId, options })
        ).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  // Rating operations
  const addProviderRating = useCallback(
    async (
      clientId: string,
      rating: Omit<ServiceRating & { providerId: Types.ObjectId }, "date">
    ): Promise<void> => {
      try {
        await dispatch(addServiceProviderRating({ clientId, rating })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  // Utility operations
  const getClientStats = useCallback(
    async (clientId: string): Promise<void> => {
      try {
        await dispatch(fetchClientStats(clientId)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const searchByLocation = useCallback(
    async (location: {
      region?: string;
      city?: string;
      district?: string;
      locality?: string;
    }): Promise<void> => {
      try {
        await dispatch(searchClientsByLocation(location)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const verifyClientExists = useCallback(
    async (params: { userId?: string; email?: string }): Promise<void> => {
      try {
        await dispatch(checkClientExists(params)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const batchUpdate = useCallback(
    async (
      updates: Array<{
        clientId: string;
        updateData: Partial<UpdateClientInput>;
      }>
    ): Promise<void> => {
      try {
        await dispatch(batchUpdateClients(updates)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  // UI actions (memoized)
  const selectClient = useCallback(
    (clientId: string | null) => dispatch(setSelectedClient(clientId)),
    [dispatch]
  );

  const openClientForm = useCallback(
    () => dispatch(toggleClientForm(true)),
    [dispatch]
  );
  const closeClientForm = useCallback(
    () => dispatch(toggleClientForm(false)),
    [dispatch]
  );
  const toggleClientFormState = useCallback(
    (open?: boolean) => dispatch(toggleClientForm(open)),
    [dispatch]
  );

  const openServiceRequestForm = useCallback(
    () => dispatch(toggleServiceRequestForm(true)),
    [dispatch]
  );
  const closeServiceRequestForm = useCallback(
    () => dispatch(toggleServiceRequestForm(false)),
    [dispatch]
  );
  const toggleServiceRequestFormState = useCallback(
    (open?: boolean) => dispatch(toggleServiceRequestForm(open)),
    [dispatch]
  );

  const openRatingForm = useCallback(
    () => dispatch(toggleRatingForm(true)),
    [dispatch]
  );
  const closeRatingForm = useCallback(
    () => dispatch(toggleRatingForm(false)),
    [dispatch]
  );
  const toggleRatingFormState = useCallback(
    (open?: boolean) => dispatch(toggleRatingForm(open)),
    [dispatch]
  );

  // Filter actions
  const updateFilters = useCallback(
    (newFilters: Partial<ClientState["filters"]>) =>
      dispatch(setFilters(newFilters)),
    [dispatch]
  );
  const resetFilters = useCallback(() => dispatch(clearFilters()), [dispatch]);

  // Clear actions
  const clearClient = useCallback(
    () => dispatch(clearCurrentClient()),
    [dispatch]
  );
  const clearAllErrors = useCallback(() => dispatch(clearErrors()), [dispatch]);
  const clearSearch = useCallback(
    () => dispatch(clearSearchResults()),
    [dispatch]
  );
  const resetState = useCallback(
    () => dispatch(resetClientState()),
    [dispatch]
  );

  // Local state updates (for optimistic updates)
  const updateClientOptimistically = useCallback(
    (updates: Partial<ClientData>) => dispatch(updateClientLocal(updates)),
    [dispatch]
  );
  const addServiceRequestOptimistically = useCallback(
    (serviceRequest: ClientServiceRequest) =>
      dispatch(addServiceRequestLocal(serviceRequest)),
    [dispatch]
  );
  const updateServiceRequestOptimistically = useCallback(
    (requestId: string, updates: Partial<ClientServiceRequest>) =>
      dispatch(updateServiceRequestLocal({ requestId, updates })),
    [dispatch]
  );

  // Helper functions (optimized)
  const getClientByIdSync = useCallback(
    (clientId: string): ClientData | undefined => {
      const state = {
        client: {
          currentClient,
          clientWithServices,
          clients,
          pagination,
          serviceRequests,
          serviceRequestsPagination,
          stats,
          searchResults,
          filters,
          loading,
          errors,
          selectedClientId,
          isClientFormOpen,
          isServiceRequestFormOpen,
          isRatingFormOpen,
        },
      };
      return selectClientById(clientId)(state);
    },
    [
      currentClient,
      clientWithServices,
      clients,
      pagination,
      serviceRequests,
      serviceRequestsPagination,
      stats,
      searchResults,
      filters,
      loading,
      errors,
      selectedClientId,
      isClientFormOpen,
      isServiceRequestFormOpen,
      isRatingFormOpen,
    ]
  );

  const getClientsByLocationSync = useCallback(
    (region?: string, city?: string): ClientData[] => {
      const state = {
        client: {
          currentClient,
          clientWithServices,
          clients,
          pagination,
          serviceRequests,
          serviceRequestsPagination,
          stats,
          searchResults,
          filters,
          loading,
          errors,
          selectedClientId,
          isClientFormOpen,
          isServiceRequestFormOpen,
          isRatingFormOpen,
        },
      };
      return selectClientsByLocation(region, city)(state);
    },
    [
      currentClient,
      clientWithServices,
      clients,
      pagination,
      serviceRequests,
      serviceRequestsPagination,
      stats,
      searchResults,
      filters,
      loading,
      errors,
      selectedClientId,
      isClientFormOpen,
      isServiceRequestFormOpen,
      isRatingFormOpen,
    ]
  );

  return {
    // State
    currentClient,
    clientWithServices,
    clients,
    pagination,
    serviceRequests,
    serviceRequestsPagination,
    stats,
    searchResults,
    filters,
    loading,
    errors,
    selectedClientId,
    isClientFormOpen,
    isServiceRequestFormOpen,
    isRatingFormOpen,

    // Computed values
    completedServiceRequests,
    pendingServiceRequests,
    hasNextPage,
    hasPrevPage,
    isLoading,
    hasErrors,

    // Client operations
    createNewClient,
    getClientById,
    getClientByUserId,
    getClientByEmail,
    updateExistingClient,
    removeClient,
    getAllClients,
    getClientWithServices,

    // Service request operations
    createServiceRequest,
    updateServiceStatus,
    getServiceRequestHistory,

    // Rating operations
    addProviderRating,

    // Utility operations
    getClientStats,
    searchByLocation,
    verifyClientExists,
    batchUpdate,

    // UI actions
    selectClient,
    openClientForm,
    closeClientForm,
    toggleClientFormState,
    openServiceRequestForm,
    closeServiceRequestForm,
    toggleServiceRequestFormState,
    openRatingForm,
    closeRatingForm,
    toggleRatingFormState,

    // Filter actions
    updateFilters,
    resetFilters,

    // Clear actions
    clearClient,
    clearAllErrors,
    clearSearch,
    resetState,

    // Local state updates
    updateClientOptimistically,
    addServiceRequestOptimistically,
    updateServiceRequestOptimistically,

    // Helper functions
    getClientByIdSync,
    getClientsByLocationSync,
  };
};
