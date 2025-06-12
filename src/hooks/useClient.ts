// src/hooks/useClient.ts
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
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
} from '@/store/slices/clientSlice';
import {
  ClientData,
  CreateClientInput,
  UpdateClientInput,
  ClientServiceRequest,
  ServiceRating,
  ClientDataWithServices,
} from '@/store/type/client_provider_Data';
import { Types } from 'mongoose';

export interface UseClientReturn {
  // State
  currentClient: ClientData | null;
  clientWithServices: ClientDataWithServices | null;
  clients: ClientData[];
  pagination: ClientState['pagination'];
  serviceRequests: ClientServiceRequest[];
  serviceRequestsPagination: ClientState['serviceRequestsPagination'];
  stats: ClientState['stats'];
  searchResults: ClientData[];
  filters: ClientState['filters'];
  loading: ClientState['loading'];
  errors: ClientState['errors'];
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
  updateExistingClient: (clientId: string, updateData: Partial<UpdateClientInput>) => Promise<void>;
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
    serviceRequest: Omit<ClientServiceRequest, 'requestId' | 'date'>
  ) => Promise<void>;
  updateServiceStatus: (
    clientId: string,
    requestId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ) => Promise<void>;
  getServiceRequestHistory: (
    clientId: string,
    options?: { status?: string; page?: number; limit?: number }
  ) => Promise<void>;
  
  // Rating operations
  addProviderRating: (
    clientId: string,
    rating: Omit<ServiceRating & { providerId: Types.ObjectId }, 'date'>
  ) => Promise<void>;
  
  // Utility operations
  getClientStats: (clientId: string) => Promise<void>;
  searchByLocation: (location: {
    region?: string;
    city?: string;
    district?: string;
    locality?: string;
  }) => Promise<void>;
  verifyClientExists: (params: { userId?: string; email?: string }) => Promise<void>;
  batchUpdate: (updates: Array<{ clientId: string; updateData: Partial<UpdateClientInput> }>) => Promise<void>;
  
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
  updateFilters: (filters: Partial<ClientState['filters']>) => void;
  resetFilters: () => void;
  
  // Clear actions
  clearClient: () => void;
  clearAllErrors: () => void;
  clearSearch: () => void;
  resetState: () => void;
  
  // Local state updates (for optimistic updates)
  updateClientOptimistically: (updates: Partial<ClientData>) => void;
  addServiceRequestOptimistically: (serviceRequest: ClientServiceRequest) => void;
  updateServiceRequestOptimistically: (requestId: string, updates: Partial<ClientServiceRequest>) => void;
  
  // Helper functions
  getClientByIdSync: (clientId: string) => ClientData | undefined;
  getClientsByLocationSync: (region?: string, city?: string) => ClientData[];
}

export const useClient = (): UseClientReturn => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
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

  // Service requests pagination - assuming it's part of client state
  const serviceRequestsPagination = useSelector((state: { client: ClientState }) => 
    state.client.serviceRequestsPagination
  );

  // Computed values
  const hasNextPage = useMemo(() => pagination.hasNextPage, [pagination.hasNextPage]);
  const hasPrevPage = useMemo(() => pagination.hasPrevPage, [pagination.hasPrevPage]);
  
  const isLoading = useMemo(() => 
    Object.values(loading).some(Boolean), [loading]
  );
  
  const hasErrors = useMemo(() => 
    Object.values(errors).some(error => error !== null), [errors]
  );

  // Client operations
  const createNewClient = useCallback(async (clientData: CreateClientInput) => {
    await dispatch(createClient(clientData)).unwrap();
  }, [dispatch]);

  const getClientById = useCallback(async (clientId: string) => {
    await dispatch(fetchClientById(clientId)).unwrap();
  }, [dispatch]);

 const getClientByUserId = useCallback((userId: string) =>
  dispatch(fetchClientByUserId(userId)).unwrap(), [dispatch]);


  const getClientByEmail = useCallback(async (email: string) => {
    await dispatch(fetchClientByEmail(email)).unwrap();
  }, [dispatch]);

  const updateExistingClient = useCallback(async (
    clientId: string, 
    updateData: Partial<UpdateClientInput>
  ) => {
    await dispatch(updateClient({ clientId, updateData })).unwrap();
  }, [dispatch]);

  const removeClient = useCallback(async (clientId: string) => {
    await dispatch(deleteClient(clientId)).unwrap();
  }, [dispatch]);

  const getAllClients = useCallback(async (options?: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    city?: string;
    district?: string;
  }) => {
    await dispatch(fetchAllClients(options ?? {})).unwrap();
  }, [dispatch]);

  const getClientWithServices = useCallback(async (clientId: string) => {
    await dispatch(fetchClientWithServices(clientId)).unwrap();
  }, [dispatch]);

  // Service request operations
  const createServiceRequest = useCallback(async (
    clientId: string,
    serviceRequest: Omit<ClientServiceRequest, 'requestId' | 'date'>
  ) => {
    await dispatch(addServiceRequest({ clientId, serviceRequest })).unwrap();
  }, [dispatch]);

  const updateServiceStatus = useCallback(async (
    clientId: string,
    requestId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ) => {
    await dispatch(updateServiceRequestStatus({ clientId, requestId, status })).unwrap();
  }, [dispatch]);

  const getServiceRequestHistory = useCallback(async (
    clientId: string,
    options?: { status?: string; page?: number; limit?: number }
  ) => {
    await dispatch(fetchServiceRequestHistory({ clientId, options })).unwrap();
  }, [dispatch]);

  // Rating operations
  const addProviderRating = useCallback(async (
    clientId: string,
    rating: Omit<ServiceRating & { providerId: Types.ObjectId }, 'date'>
  ) => {
    await dispatch(addServiceProviderRating({ clientId, rating })).unwrap();
  }, [dispatch]);

  // Utility operations
  const getClientStats = useCallback(async (clientId: string) => {
    await dispatch(fetchClientStats(clientId)).unwrap();
  }, [dispatch]);

  const searchByLocation = useCallback(async (location: {
    region?: string;
    city?: string;
    district?: string;
    locality?: string;
  }) => {
    await dispatch(searchClientsByLocation(location)).unwrap();
  }, [dispatch]);

  const verifyClientExists = useCallback(async (params: { userId?: string; email?: string }) => {
    await dispatch(checkClientExists(params)).unwrap();
  }, [dispatch]);

  const batchUpdate = useCallback(async (
    updates: Array<{ clientId: string; updateData: Partial<UpdateClientInput> }>
  ) => {
    await dispatch(batchUpdateClients(updates)).unwrap();
  }, [dispatch]);

  // UI actions
  const selectClient = useCallback((clientId: string | null) => {
    dispatch(setSelectedClient(clientId));
  }, [dispatch]);

  const openClientForm = useCallback(() => {
    dispatch(toggleClientForm(true));
  }, [dispatch]);

  const closeClientForm = useCallback(() => {
    dispatch(toggleClientForm(false));
  }, [dispatch]);

  const toggleClientFormState = useCallback((open?: boolean) => {
    dispatch(toggleClientForm(open));
  }, [dispatch]);

  const openServiceRequestForm = useCallback(() => {
    dispatch(toggleServiceRequestForm(true));
  }, [dispatch]);

  const closeServiceRequestForm = useCallback(() => {
    dispatch(toggleServiceRequestForm(false));
  }, [dispatch]);

  const toggleServiceRequestFormState = useCallback((open?: boolean) => {
    dispatch(toggleServiceRequestForm(open));
  }, [dispatch]);

  const openRatingForm = useCallback(() => {
    dispatch(toggleRatingForm(true));
  }, [dispatch]);

  const closeRatingForm = useCallback(() => {
    dispatch(toggleRatingForm(false));
  }, [dispatch]);

  const toggleRatingFormState = useCallback((open?: boolean) => {
    dispatch(toggleRatingForm(open));
  }, [dispatch]);

  // Filter actions
  const updateFilters = useCallback((newFilters: Partial<ClientState['filters']>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Clear actions
  const clearClient = useCallback(() => {
    dispatch(clearCurrentClient());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetClientState());
  }, [dispatch]);

  // Local state updates (for optimistic updates)
  const updateClientOptimistically = useCallback((updates: Partial<ClientData>) => {
    dispatch(updateClientLocal(updates));
  }, [dispatch]);

  const addServiceRequestOptimistically = useCallback((serviceRequest: ClientServiceRequest) => {
    dispatch(addServiceRequestLocal(serviceRequest));
  }, [dispatch]);

  const updateServiceRequestOptimistically = useCallback((
    requestId: string, 
    updates: Partial<ClientServiceRequest>
  ) => {
    dispatch(updateServiceRequestLocal({ requestId, updates }));
  }, [dispatch]);

  // Helper functions
  const getClientByIdSync = useCallback((clientId: string) => {
    return selectClientById(clientId)({ client: { 
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
      isRatingFormOpen 
    } });
  }, [
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
    isRatingFormOpen
  ]);

  const getClientsByLocationSync = useCallback((region?: string, city?: string) => {
    return selectClientsByLocation(region, city)({ client: { 
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
      isRatingFormOpen 
    } });
  }, [
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
    isRatingFormOpen
  ]);

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