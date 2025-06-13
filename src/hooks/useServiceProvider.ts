// src/hooks/useProvider.ts

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type {
  CreateProviderInput,
  UpdateProviderInput,
  WitnessDetails,
} from '@/store/type/client_provider_Data';

import { setFilters, clearFilters } from '@/store/slices/categorySlice';
import { selectFilters } from '@/store/slices/clientSlice';
import { selectProviderState, selectCurrentProvider, selectProviderWithServices, selectAllProviders, selectProviderSearchResults, selectProviderPagination, selectProviderStats, selectSelectedLocation, selectProviderLoading, selectIsCreating, selectIsUpdating, selectProviderError, createProvider, getProviderById, getProviderByUserId, getProviderWithServices, updateProvider, deleteProvider, getAllProviders, searchProviders, getProviderStats, updateWitnessDetails, setSelectedLocation, clearCurrentProvider, clearProviderSearchResults, clearProviderError, setProviderPagination, resetProviderState } from '@/store/slices/providerSlice';

export interface UseProviderReturn {
  // State
  providerState: ReturnType<typeof selectProviderState>;
  currentProvider: ReturnType<typeof selectCurrentProvider>;
  providerWithServices: ReturnType<typeof selectProviderWithServices>;
  allProviders: ReturnType<typeof selectAllProviders>;
  searchResults: ReturnType<typeof selectProviderSearchResults>;
  pagination: ReturnType<typeof selectProviderPagination>;
  stats: ReturnType<typeof selectProviderStats>;
  selectedLocation: ReturnType<typeof selectSelectedLocation>;
  filters: ReturnType<typeof selectFilters>;
  
  // Loading states
  loading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  
  // Error state
  error: string | null;
  
  // Actions
  actions: {
    // CRUD Operations
    createProvider: (providerData: CreateProviderInput) => Promise<void>;
    getProviderById: (providerId: string) => Promise<void>;
    getProviderByUserId: (userId: string) => Promise<void>;
    getProviderWithServices: (userId: string) => Promise<void>;
    updateProvider: (providerId: string, updateData: Partial<UpdateProviderInput>) => Promise<void>;
    deleteProvider: (providerId: string) => Promise<void>;
    
    // List Operations
    getAllProviders: (options?: {
      page?: number;
      limit?: number;
      region?: string;
      city?: string;
      serviceId?: string;
      minRating?: number;
      search?: string;
    }) => Promise<void>;
    searchProviders: (query: string) => Promise<void>;
    
    // Stats
    getProviderStats: (providerId: string) => Promise<void>;
    
    // Witness Details
    updateWitnessDetails: (providerId: string, witnessDetails: WitnessDetails[]) => Promise<void>;
    
    // UI State Management
    setSelectedLocation: (location: { region?: string; city?: string; district?: string }) => void;
    setFilters: (filters: { serviceId?: string; minRating?: number; search?: string }) => void;
    clearFilters: () => void;
    
    // Provider State Management
    clearCurrentProvider: () => void;
    clearSearchResults: () => void;
    clearError: () => void;
    
    // Pagination
    setPagination: (pagination: { page?: number; limit?: number }) => void;
    goToPage: (page: number) => Promise<void>;
    changePageSize: (limit: number) => Promise<void>;
    
    // Reset
    resetState: () => void;
    
    // Refresh current data
    refresh: () => Promise<void>;
  };
  
  // Computed values
  computed: {
    hasProviders: boolean;
    hasSearchResults: boolean;
    hasCurrentProvider: boolean;
    hasStats: boolean;
    totalPages: number;
    currentPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasFilters: boolean;
    hasLocationFilter: boolean;
  };
}

export const useProvider = (): UseProviderReturn => {
  const dispatch = useAppDispatch();
  
  // State selectors
  const providerState = useAppSelector(selectProviderState);
  const currentProvider = useAppSelector(selectCurrentProvider);
  const providerWithServices = useAppSelector(selectProviderWithServices);
  const allProviders = useAppSelector(selectAllProviders);
  const searchResults = useAppSelector(selectProviderSearchResults);
  const pagination = useAppSelector(selectProviderPagination);
  const stats = useAppSelector(selectProviderStats);
  const selectedLocation = useAppSelector(selectSelectedLocation);
  const filters = useAppSelector(selectFilters);
  const loading = useAppSelector(selectProviderLoading);
  const isCreating = useAppSelector(selectIsCreating);
  const isUpdating = useAppSelector(selectIsUpdating);
  const error = useAppSelector(selectProviderError);

  // Action creators
  const handleCreateProvider = useCallback(async (providerData: CreateProviderInput) => {
    try {
      await dispatch(createProvider(providerData)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetProviderById = useCallback(async (providerId: string) => {
    try {
      await dispatch(getProviderById(providerId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetProviderByUserId = useCallback(async (userId: string) => {
    try {
      await dispatch(getProviderByUserId(userId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetProviderWithServices = useCallback(async (userId: string) => {
    try {
      await dispatch(getProviderWithServices(userId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleUpdateProvider = useCallback(async (providerId: string, updateData: Partial<UpdateProviderInput>) => {
    try {
      await dispatch(updateProvider({ providerId, updateData })).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleDeleteProvider = useCallback(async (providerId: string) => {
    try {
      await dispatch(deleteProvider(providerId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetAllProviders = useCallback(async (options: {
    page?: number;
    limit?: number;
    region?: string;
    city?: string;
    serviceId?: string;
    minRating?: number;
    search?: string;
  } = {}) => {
    try {
      await dispatch(getAllProviders(options)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleSearchProviders = useCallback(async (query: string) => {
    try {
      await dispatch(searchProviders(query)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetProviderStats = useCallback(async (providerId: string) => {
    try {
      await dispatch(getProviderStats(providerId)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleUpdateWitnessDetails = useCallback(async (providerId: string, witnessDetails: WitnessDetails[]) => {
    try {
      await dispatch(updateWitnessDetails({ providerId, witnessDetails })).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // UI actions
  const handleSetSelectedLocation = useCallback((location: { region?: string; city?: string; district?: string }) => {
    dispatch(setSelectedLocation(location));
  }, [dispatch]);

  const handleSetFilters = useCallback((newFilters: { serviceId?: string; minRating?: number; search?: string }) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleClearCurrentProvider = useCallback(() => {
    dispatch(clearCurrentProvider());
  }, [dispatch]);

  const handleClearSearchResults = useCallback(() => {
    dispatch(clearProviderSearchResults());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearProviderError());
  }, [dispatch]);

  const handleSetPagination = useCallback((newPagination: { page?: number; limit?: number }) => {
    dispatch(setProviderPagination(newPagination));
  }, [dispatch]);

  const handleGoToPage = useCallback(async (page: number) => {
    handleSetPagination({ page });
    await handleGetAllProviders({
      page,
      limit: pagination.limit,
      ...selectedLocation,
      ...filters
    });
  }, [pagination.limit, selectedLocation, filters, handleGetAllProviders, handleSetPagination]);

  const handleChangePageSize = useCallback(async (limit: number) => {
    handleSetPagination({ page: 1, limit });
    await handleGetAllProviders({
      page: 1,
      limit,
      ...selectedLocation,
      ...filters
    });
  }, [selectedLocation, filters, handleGetAllProviders, handleSetPagination]);

  const handleResetState = useCallback(() => {
    dispatch(resetProviderState());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    if (currentProvider) {
      await handleGetProviderById(currentProvider._id.toString());
    } else {
      await handleGetAllProviders({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...selectedLocation,
        ...filters
      });
    }
  }, [currentProvider, pagination, selectedLocation, filters, handleGetProviderById, handleGetAllProviders]);

  // Computed values
  const computed = {
    hasProviders: allProviders.length > 0,
    hasSearchResults: searchResults.length > 0,
    hasCurrentProvider: currentProvider !== null,
    hasStats: stats !== null,
    totalPages: pagination.totalPages,
    currentPage: pagination.currentPage,
    isFirstPage: pagination.currentPage === 1,
    isLastPage: pagination.currentPage === pagination.totalPages,
    hasFilters: Object.keys(filters).length > 0 || Object.keys(selectedLocation).length > 0,
    hasLocationFilter: Object.keys(selectedLocation).length > 0,
  };

  return {
    // State
    providerState,
    currentProvider,
    providerWithServices,
    allProviders,
    searchResults,
    pagination,
    stats,
    selectedLocation,
    filters,
    
    // Loading states
    loading,
    isCreating,
    isUpdating,
    
    // Error state
    error,
    
    // Actions
    actions: {
      // CRUD Operations
      createProvider: handleCreateProvider,
      getProviderById: handleGetProviderById,
      getProviderByUserId: handleGetProviderByUserId,
      getProviderWithServices: handleGetProviderWithServices,
      updateProvider: handleUpdateProvider,
      deleteProvider: handleDeleteProvider,
      
      // List Operations
      getAllProviders: handleGetAllProviders,
      searchProviders: handleSearchProviders,
      
      // Stats
      getProviderStats: handleGetProviderStats,
      
      // Witness Details
      updateWitnessDetails: handleUpdateWitnessDetails,
      
      // UI State Management
      setSelectedLocation: handleSetSelectedLocation,
      setFilters: handleSetFilters,
      clearFilters: handleClearFilters,
      
      // Provider State Management
      clearCurrentProvider: handleClearCurrentProvider,
      clearSearchResults: handleClearSearchResults,
      clearError: handleClearError,
      
      // Pagination
      setPagination: handleSetPagination,
      goToPage: handleGoToPage,
      changePageSize: handleChangePageSize,
      
      // Reset
      resetState: handleResetState,
      
      // Refresh
      refresh: handleRefresh,
    },
    
    // Computed values
    computed,
  };
};