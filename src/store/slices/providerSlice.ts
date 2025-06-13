// src/store/slices/clientProviderSlice.ts

import { ClientApiService, ProviderApiService } from '@/lib/client-api/providerClientApi';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ClientData, ClientDataWithServices, ServiceProviderData, ProviderDataWithServices, CreateClientInput, UpdateClientInput, CreateProviderInput, UpdateProviderInput, WitnessDetails } from '../type/client_provider_Data';

// State interfaces
interface ClientState {
  currentClient: ClientData | null;
  clientWithServices: ClientDataWithServices | null;
  allClients: ClientData[];
  searchResults: ClientData[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  stats: {
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatingsGiven: number;
  } | null;
}

interface ProviderState {
  currentProvider: ServiceProviderData | null;
  providerWithServices: ProviderDataWithServices | null;
  allProviders: ServiceProviderData[];
  searchResults: ServiceProviderData[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProviders: number;
    limit: number;
  };
  stats: {
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatings: number;
  } | null;
}

interface ClientProviderState {
  client: ClientState;
  provider: ProviderState;
  ui: {
    activeTab: 'client' | 'provider';
    isCreating: boolean;
    isUpdating: boolean;
    selectedLocation: {
      region?: string;
      city?: string;
      district?: string;
    };
    filters: {
      serviceId?: string;
      minRating?: number;
      search?: string;
    };
  };
}

// Initial state
const initialState: ClientProviderState = {
  client: {
    currentClient: null,
    clientWithServices: null,
    allClients: [],
    searchResults: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      total: 0,
      limit: 10
    },
    stats: null
  },
  provider: {
    currentProvider: null,
    providerWithServices: null,
    allProviders: [],
    searchResults: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalProviders: 0,
      limit: 10
    },
    stats: null
  },
  ui: {
    activeTab: 'client',
    isCreating: false,
    isUpdating: false,
    selectedLocation: {},
    filters: {}
  }
};

// Client Async Thunks
export const createClient = createAsyncThunk(
  'clientProvider/createClient',
  async (clientData: CreateClientInput, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.createClient(clientData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to create client');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getClientById = createAsyncThunk(
  'clientProvider/getClientById',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientById(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getClientByUserId = createAsyncThunk(
  'clientProvider/getClientByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientByUserId(userId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getClientWithServices = createAsyncThunk(
  'clientProvider/getClientWithServices',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientWithServices(userId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client with services');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clientProvider/updateClient',
  async ({ clientId, updateData }: { clientId: string; updateData: Partial<UpdateClientInput> }, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.updateClient(clientId, updateData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to update client');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clientProvider/deleteClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.deleteClient(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to delete client');
      }
      return { clientId, message: response.data};
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getAllClients = createAsyncThunk(
  'clientProvider/getAllClients',
  async (options: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    city?: string;
    district?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getAllClients(options);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch clients');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const searchClients = createAsyncThunk(
  'clientProvider/searchClients',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.searchClients(query);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to search clients');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);


export const getClientStats = createAsyncThunk(
  'clientProvider/getClientStats',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientStats(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client stats');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Provider Async Thunks
export const createProvider = createAsyncThunk(
  'clientProvider/createProvider',
  async (providerData: CreateProviderInput, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.createProvider(providerData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to create provider');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getProviderById = createAsyncThunk(
  'clientProvider/getProviderById',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.getProviderById(providerId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch provider');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getProviderByUserId = createAsyncThunk(
  'clientProvider/getProviderByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.getProviderByUserId(userId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch provider');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getProviderWithServices = createAsyncThunk(
  'clientProvider/getProviderWithServices',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.getProviderWithServices(userId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch provider with services');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateProvider = createAsyncThunk(
  'clientProvider/updateProvider',
  async ({ providerId, updateData }: { providerId: string; updateData: Partial<UpdateProviderInput> }, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.updateProvider(providerId, updateData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to update provider');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteProvider = createAsyncThunk(
  'clientProvider/deleteProvider',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.deleteProvider(providerId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to delete provider');
      }
      return { providerId, message: response.data!.message };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getAllProviders = createAsyncThunk(
  'clientProvider/getAllProviders',
  async (options: {
    page?: number;
    limit?: number;
    region?: string;
    city?: string;
    serviceId?: string;
    minRating?: number;
    search?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.getAllProviders(options);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch providers');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const searchProviders = createAsyncThunk(
  'clientProvider/searchProviders',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.searchProviders(query);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to search providers');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const getProviderStats = createAsyncThunk(
  'clientProvider/getProviderStats',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.getProviderStats(providerId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch provider stats');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateWitnessDetails = createAsyncThunk(
  'clientProvider/updateWitnessDetails',
  async ({ providerId, witnessDetails }: { providerId: string; witnessDetails: WitnessDetails[] }, { rejectWithValue }) => {
    try {
      const response = await ProviderApiService.updateWitnessDetails(providerId, witnessDetails);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to update witness details');
      }
      return response.data!;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Create the slice
export const clientProviderSlice = createSlice({
  name: 'clientProvider',
  initialState,
  reducers: {
    // UI Actions
    setActiveTab: (state, action: PayloadAction<'client' | 'provider'>) => {
      state.ui.activeTab = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<{ region?: string; city?: string; district?: string }>) => {
      state.ui.selectedLocation = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ serviceId?: string; minRating?: number; search?: string }>) => {
      state.ui.filters = action.payload;
    },
    clearFilters: (state) => {
      state.ui.filters = {};
      state.ui.selectedLocation = {};
    },
    
    // Client Actions
    clearCurrentClient: (state) => {
      state.client.currentClient = null;
      state.client.clientWithServices = null;
      state.client.error = null;
    },
    clearClientSearchResults: (state) => {
      state.client.searchResults = [];
    },
    clearClientError: (state) => {
      state.client.error = null;
    },
    
    // Provider Actions
    clearCurrentProvider: (state) => {
      state.provider.currentProvider = null;
      state.provider.providerWithServices = null;
      state.provider.error = null;
    },
    clearProviderSearchResults: (state) => {
      state.provider.searchResults = [];
    },
    clearProviderError: (state) => {
      state.provider.error = null;
    },
    
    // Pagination Actions
    setClientPagination: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      if (action.payload.page) state.client.pagination.currentPage = action.payload.page;
      if (action.payload.limit) state.client.pagination.limit = action.payload.limit;
    },
    setProviderPagination: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      if (action.payload.page) state.provider.pagination.currentPage = action.payload.page;
      if (action.payload.limit) state.provider.pagination.limit = action.payload.limit;
    },
    
    // Reset Actions
    resetClientState: (state) => {
      state.client = initialState.client;
    },
    resetProviderState: (state) => {
      state.provider = initialState.provider;
    },
    resetAllState: () => initialState
  },
  extraReducers: (builder) => {
    // Client Cases
    builder
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
        state.ui.isCreating = true;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.currentClient = action.payload;
        state.client.allClients.push(action.payload);
        state.ui.isCreating = false;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
        state.ui.isCreating = false;
      })
      
      // Get Client by ID
      .addCase(getClientById.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.currentClient = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Get Client by User ID
      .addCase(getClientByUserId.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(getClientByUserId.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.currentClient = action.payload;
      })
      .addCase(getClientByUserId.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Get Client with Services
      .addCase(getClientWithServices.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(getClientWithServices.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.clientWithServices = action.payload;
      })
      .addCase(getClientWithServices.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
        state.ui.isUpdating = true;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.currentClient = action.payload;
        const index = state.client.allClients.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.client.allClients[index] = action.payload;
        }
        state.ui.isUpdating = false;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
        state.ui.isUpdating = false;
      })
      
      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.allClients = state.client.allClients.filter(c => c._id.toString() !== action.payload.clientId);
        if (state.client.currentClient?._id.toString() === action.payload.clientId) {
          state.client.currentClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Get All Clients
      .addCase(getAllClients.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.allClients = action.payload.clients;
        state.client.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: state.client.pagination.limit
        };
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Search Clients
      .addCase(searchClients.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(searchClients.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.searchResults = action.payload.clients;
      })
      .addCase(searchClients.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Get Client Stats
      .addCase(getClientStats.pending, (state) => {
        state.client.loading = true;
        state.client.error = null;
      })
      .addCase(getClientStats.fulfilled, (state, action) => {
        state.client.loading = false;
        state.client.stats = action.payload;
      })
      .addCase(getClientStats.rejected, (state, action) => {
        state.client.loading = false;
        state.client.error = action.payload as string;
      })
      
      // Provider Cases
      // Create Provider
      .addCase(createProvider.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
        state.ui.isCreating = true;
      })
      .addCase(createProvider.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.currentProvider = action.payload;
        state.provider.allProviders.push(action.payload);
        state.ui.isCreating = false;
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
        state.ui.isCreating = false;
      })
      
      // Get Provider by ID
      .addCase(getProviderById.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(getProviderById.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.currentProvider = action.payload;
      })
      .addCase(getProviderById.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Get Provider by User ID
      .addCase(getProviderByUserId.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(getProviderByUserId.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.currentProvider = action.payload;
      })
      .addCase(getProviderByUserId.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Get Provider with Services
      .addCase(getProviderWithServices.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(getProviderWithServices.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.providerWithServices = action.payload;
      })
      .addCase(getProviderWithServices.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Update Provider
      .addCase(updateProvider.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
        state.ui.isUpdating = true;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.currentProvider = action.payload;
        const index = state.provider.allProviders.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.provider.allProviders[index] = action.payload;
        }
        state.ui.isUpdating = false;
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
        state.ui.isUpdating = false;
      })
      
      // Delete Provider
      .addCase(deleteProvider.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(deleteProvider.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.allProviders = state.provider.allProviders.filter(p => p._id.toString() !== action.payload.providerId);
        if (state.provider.currentProvider?._id.toString() === action.payload.providerId) {
          state.provider.currentProvider = null;
        }
      })
      .addCase(deleteProvider.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Get All Providers
      .addCase(getAllProviders.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(getAllProviders.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.allProviders = action.payload.providers;
        state.provider.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalProviders: action.payload.totalProviders,
          limit: state.provider.pagination.limit
        };
      })
      .addCase(getAllProviders.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Search Providers
      .addCase(searchProviders.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(searchProviders.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.searchResults = action.payload.providers;
      })
      .addCase(searchProviders.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Get Provider Stats
      .addCase(getProviderStats.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(getProviderStats.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.stats = action.payload;
      })
      .addCase(getProviderStats.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      })
      
      // Update Witness Details
      .addCase(updateWitnessDetails.pending, (state) => {
        state.provider.loading = true;
        state.provider.error = null;
      })
      .addCase(updateWitnessDetails.fulfilled, (state, action) => {
        state.provider.loading = false;
        state.provider.currentProvider = action.payload;
        const index = state.provider.allProviders.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.provider.allProviders[index] = action.payload;
        }
      })
      .addCase(updateWitnessDetails.rejected, (state, action) => {
        state.provider.loading = false;
        state.provider.error = action.payload as string;
      });
  }
});

// Export actions
export const {
  setActiveTab,
  setSelectedLocation,
  setFilters,
  clearFilters,
  clearCurrentClient,
  clearClientSearchResults,
  clearClientError,
  clearCurrentProvider,
  clearProviderSearchResults,
  clearProviderError,
  setClientPagination,
  setProviderPagination,
  resetClientState,
  resetProviderState,
  resetAllState
} = clientProviderSlice.actions;

// Export reducer
export default clientProviderSlice.reducer;

// Selectors
export const selectClientState = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client;
export const selectProviderState = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider;
export const selectUIState = (state: { clientProvider: ClientProviderState }) => state.clientProvider.ui;
export const selectCurrentClient = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.currentClient;
export const selectCurrentProvider = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.currentProvider;
export const selectClientLoading = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.loading;
export const selectProviderLoading = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.loading;
export const selectClientError = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.error;
export const selectProviderError = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.error;
export const selectAllClients = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.allClients;
export const selectAllProviders = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.allProviders;
export const selectClientSearchResults = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.searchResults;
export const selectProviderSearchResults = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.searchResults;
export const selectClientWithServices = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.clientWithServices;
export const selectProviderWithServices = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.providerWithServices;
export const selectClientPagination = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.pagination;
export const selectProviderPagination = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.pagination;
export const selectClientStats = (state: { clientProvider: ClientProviderState }) => state.clientProvider.client.stats;
export const selectProviderStats = (state: { clientProvider: ClientProviderState }) => state.clientProvider.provider.stats;
export const selectActiveTab = (state: { clientProvider: ClientProviderState }) => state.clientProvider.ui.activeTab;
export const selectSelectedLocation = (state: { clientProvider: ClientProviderState }) => state.clientProvider.ui.selectedLocation;
export const selectFilters = (state: { clientProvider: ClientProviderState }) => state.clientProvider.ui.filters;
export const selectIsCreating = (state: { clientProvider: ClientProviderState }) => state.clientProvider.ui.isCreating;
export const selectIsUpdating = (state: { clientProvider: ClientProviderState }) => state.clientProvider.ui.isUpdating;