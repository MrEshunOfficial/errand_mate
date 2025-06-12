// src/store/slices/clientSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ClientData, 
  CreateClientInput, 
  UpdateClientInput, 
  ClientServiceRequest, 
  ServiceRating, 
  ClientDataWithServices 
} from '@/store/type/client_provider_Data';
import { Types } from 'mongoose';
import ClientApiService from '@/lib/client-api/customerClientSide';

// State interface
export interface ClientState {
  // Current client data
  currentClient: ClientData | null;
  clientWithServices: ClientDataWithServices | null;
  
  // Clients list with pagination
  clients: ClientData[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  
  // Service requests
  serviceRequests: ClientServiceRequest[];
  serviceRequestsPagination: {
    total: number;
    page: number;
    limit: number;
  };
  
  // Client statistics
  stats: {
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatingsGiven: number;
  } | null;
  
  // Search and filters
  searchResults: ClientData[];
  filters: {
    search: string;
    region: string;
    city: string;
    district: string;
    locality: string;
  };
  
  // Loading states
  loading: {
    fetchClient: boolean;
    createClient: boolean;
    updateClient: boolean;
    deleteClient: boolean;
    fetchClients: boolean;
    fetchServiceRequests: boolean;
    addServiceRequest: boolean;
    updateServiceRequestStatus: boolean;
    addRating: boolean;
    fetchStats: boolean;
    searchClients: boolean;
    batchUpdate: boolean;
  };
  
  // Error states
  errors: {
    fetchClient: string | null;
    createClient: string | null;
    updateClient: string | null;
    deleteClient: string | null;
    fetchClients: string | null;
    fetchServiceRequests: string | null;
    addServiceRequest: string | null;
    updateServiceRequestStatus: string | null;
    addRating: string | null;
    fetchStats: string | null;
    searchClients: string | null;
    batchUpdate: string | null;
  };
  
  // UI state
  selectedClientId: string | null;
  isClientFormOpen: boolean;
  isServiceRequestFormOpen: boolean;
  isRatingFormOpen: boolean;
}

// Initial state
const initialState: ClientState = {
  currentClient: null,
  clientWithServices: null,
  clients: [],
  pagination: {
    page: 1,
    totalPages: 0,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  serviceRequests: [],
  serviceRequestsPagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  stats: null,
  searchResults: [],
  filters: {
    search: '',
    region: '',
    city: '',
    district: '',
    locality: '',
  },
  loading: {
    fetchClient: false,
    createClient: false,
    updateClient: false,
    deleteClient: false,
    fetchClients: false,
    fetchServiceRequests: false,
    addServiceRequest: false,
    updateServiceRequestStatus: false,
    addRating: false,
    fetchStats: false,
    searchClients: false,
    batchUpdate: false,
  },
  errors: {
    fetchClient: null,
    createClient: null,
    updateClient: null,
    deleteClient: null,
    fetchClients: null,
    fetchServiceRequests: null,
    addServiceRequest: null,
    updateServiceRequestStatus: null,
    addRating: null,
    fetchStats: null,
    searchClients: null,
    batchUpdate: null,
  },
  selectedClientId: null,
  isClientFormOpen: false,
  isServiceRequestFormOpen: false,
  isRatingFormOpen: false,
};

// Async thunks
export const createClient = createAsyncThunk(
  'client/createClient',
  async (clientData: CreateClientInput, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.createClient(clientData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to create client');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'client/fetchClientById',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientById(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientByUserId = createAsyncThunk(
  'client/fetchClientByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientByUserId(userId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientByEmail = createAsyncThunk(
  'client/fetchClientByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientByEmail(email);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateClient = createAsyncThunk(
  'client/updateClient',
  async (
    { clientId, updateData }: { clientId: string; updateData: Partial<UpdateClientInput> },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.updateClient(clientId, updateData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to update client');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteClient = createAsyncThunk(
  'client/deleteClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.deleteClient(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to delete client');
      }
      return { clientId, deleted: response.data?.deleted };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchAllClients = createAsyncThunk(
  'client/fetchAllClients',
  async (
    options: {
      page?: number;
      limit?: number;
      search?: string;
      region?: string;
      city?: string;
      district?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.getAllClients(options);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch clients');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addServiceRequest = createAsyncThunk(
  'client/addServiceRequest',
  async (
    {
      clientId,
      serviceRequest,
    }: {
      clientId: string;
      serviceRequest: Omit<ClientServiceRequest, 'requestId' | 'date'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.addServiceRequest(clientId, serviceRequest);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to add service request');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateServiceRequestStatus = createAsyncThunk(
  'client/updateServiceRequestStatus',
  async (
    {
      clientId,
      requestId,
      status,
    }: {
      clientId: string;
      requestId: string;
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.updateServiceRequestStatus(clientId, requestId, status);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to update service request status');
      }
      return { clientId, requestId, status, client: response.data };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchServiceRequestHistory = createAsyncThunk(
  'client/fetchServiceRequestHistory',
  async (
    {
      clientId,
      options = {},
    }: {
      clientId: string;
      options?: { status?: string; page?: number; limit?: number };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.getServiceRequestHistory(clientId, options);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch service request history');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addServiceProviderRating = createAsyncThunk(
  'client/addServiceProviderRating',
  async (
    {
      clientId,
      rating,
    }: {
      clientId: string;
      rating: Omit<ServiceRating & { providerId: Types.ObjectId }, 'date'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.addServiceProviderRating(clientId, rating);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to add service provider rating');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientStats = createAsyncThunk(
  'client/fetchClientStats',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientStats(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client statistics');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const searchClientsByLocation = createAsyncThunk(
  'client/searchClientsByLocation',
  async (
    {
      region,
      city,
      district,
      locality,
    }: {
      region?: string;
      city?: string;
      district?: string;
      locality?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.searchClientsByLocation(region, city, district, locality);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to search clients by location');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const checkClientExists = createAsyncThunk(
  'client/checkClientExists',
  async (
    { userId, email }: { userId?: string; email?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.checkClientExists(userId, email);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to check client existence');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const batchUpdateClients = createAsyncThunk(
  'client/batchUpdateClients',
  async (
    updates: Array<{ clientId: string; updateData: Partial<UpdateClientInput> }>,
    { rejectWithValue }
  ) => {
    try {
      const response = await ClientApiService.batchUpdateClients(updates);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to batch update clients');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientWithServices = createAsyncThunk(
  'client/fetchClientWithServices',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await ClientApiService.getClientWithServices(clientId);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch client with services');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    // UI actions
    setSelectedClient: (state, action: PayloadAction<string | null>) => {
      state.selectedClientId = action.payload;
    },
    
    toggleClientForm: (state, action: PayloadAction<boolean | undefined>) => {
      state.isClientFormOpen = action.payload ?? !state.isClientFormOpen;
    },
    
    toggleServiceRequestForm: (state, action: PayloadAction<boolean | undefined>) => {
      state.isServiceRequestFormOpen = action.payload ?? !state.isServiceRequestFormOpen;
    },
    
    toggleRatingForm: (state, action: PayloadAction<boolean | undefined>) => {
      state.isRatingFormOpen = action.payload ?? !state.isRatingFormOpen;
    },
    
    // Filter actions
    setFilters: (state, action: PayloadAction<Partial<ClientState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Clear actions
    clearCurrentClient: (state) => {
      state.currentClient = null;
      state.clientWithServices = null;
    },
    
    clearErrors: (state) => {
      state.errors = initialState.errors;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    // Reset state
    resetClientState: () => initialState,
    
    // Local state updates (for optimistic updates)
    updateClientLocal: (state, action: PayloadAction<Partial<ClientData>>) => {
      if (state.currentClient) {
        state.currentClient = { ...state.currentClient, ...action.payload };
      }
      
      // Update in clients list
      const index = state.clients.findIndex(client => client._id === action.payload._id);
      if (index !== -1) {
        state.clients[index] = { ...state.clients[index], ...action.payload };
      }
    },
    
    // Service request local updates
    addServiceRequestLocal: (state, action: PayloadAction<ClientServiceRequest>) => {
      if (state.currentClient) {
        state.currentClient.serviceRequestHistory = [
          ...(state.currentClient.serviceRequestHistory || []),
          action.payload,
        ];
      }
      state.serviceRequests.unshift(action.payload);
    },
    
    updateServiceRequestLocal: (state, action: PayloadAction<{ requestId: string; updates: Partial<ClientServiceRequest> }>) => {
      const { requestId, updates } = action.payload;
      
      // Update in current client
      if (state.currentClient?.serviceRequestHistory) {
        const index = state.currentClient.serviceRequestHistory.findIndex(
          req => req.requestId.toString() === requestId
        );
        if (index !== -1) {
          state.currentClient.serviceRequestHistory[index] = {
            ...state.currentClient.serviceRequestHistory[index],
            ...updates,
          };
        }
      }
      
      // Update in service requests list
      const serviceReqIndex = state.serviceRequests.findIndex(
        req => req.requestId.toString() === requestId
      );
      if (serviceReqIndex !== -1) {
        state.serviceRequests[serviceReqIndex] = {
          ...state.serviceRequests[serviceReqIndex],
          ...updates,
        };
      }
    },
  },
  
  extraReducers: (builder) => {
    // Create client
    builder
      .addCase(createClient.pending, (state) => {
        state.loading.createClient = true;
        state.errors.createClient = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading.createClient = false;
        if (action.payload) {
          state.currentClient = action.payload;
          state.clients.unshift(action.payload);
        }
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading.createClient = false;
        state.errors.createClient = action.payload as string;
      });

    // Fetch client by ID
    builder
      .addCase(fetchClientById.pending, (state) => {
        state.loading.fetchClient = true;
        state.errors.fetchClient = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading.fetchClient = false;
        if (action.payload) {
          state.currentClient = action.payload;
        }
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading.fetchClient = false;
        state.errors.fetchClient = action.payload as string;
      });

    // Fetch client by user ID
    builder
      .addCase(fetchClientByUserId.pending, (state) => {
        state.loading.fetchClient = true;
        state.errors.fetchClient = null;
      })
      .addCase(fetchClientByUserId.fulfilled, (state, action) => {
        state.loading.fetchClient = false;
        if (action.payload) {
          state.currentClient = action.payload;
        }
      })
      .addCase(fetchClientByUserId.rejected, (state, action) => {
        state.loading.fetchClient = false;
        state.errors.fetchClient = action.payload as string;
      });

    // Fetch client by email
    builder
      .addCase(fetchClientByEmail.pending, (state) => {
        state.loading.fetchClient = true;
        state.errors.fetchClient = null;
      })
      .addCase(fetchClientByEmail.fulfilled, (state, action) => {
        state.loading.fetchClient = false;
        if (action.payload) {
          state.currentClient = action.payload;
        }
      })
      .addCase(fetchClientByEmail.rejected, (state, action) => {
        state.loading.fetchClient = false;
        state.errors.fetchClient = action.payload as string;
      });

    // Update client
    builder
      .addCase(updateClient.pending, (state) => {
        state.loading.updateClient = true;
        state.errors.updateClient = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading.updateClient = false;
        if (action.payload) {
          state.currentClient = action.payload;
          
          // Update in clients list
          const index = state.clients.findIndex(client => client._id === action.payload!._id);
          if (index !== -1) {
            state.clients[index] = action.payload;
          }
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading.updateClient = false;
        state.errors.updateClient = action.payload as string;
      });

    // Delete client
    builder
      .addCase(deleteClient.pending, (state) => {
        state.loading.deleteClient = true;
        state.errors.deleteClient = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading.deleteClient = false;
        const { clientId } = action.payload;
        
        // Remove from clients list
        state.clients = state.clients.filter(client => client._id.toString() !== clientId);
        
        // Clear current client if it was deleted
        if (state.currentClient?._id.toString() === clientId) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading.deleteClient = false;
        state.errors.deleteClient = action.payload as string;
      });

    // Fetch all clients
    builder
      .addCase(fetchAllClients.pending, (state) => {
        state.loading.fetchClients = true;
        state.errors.fetchClients = null;
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.loading.fetchClients = false;
        if (action.payload) {
          state.clients = action.payload.items;
          state.pagination = {
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            total: action.payload.total,
            hasNextPage: action.payload.hasNextPage,
            hasPrevPage: action.payload.hasPrevPage,
          };
        }
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.loading.fetchClients = false;
        state.errors.fetchClients = action.payload as string;
      });

    // Add service request
    builder
      .addCase(addServiceRequest.pending, (state) => {
        state.loading.addServiceRequest = true;
        state.errors.addServiceRequest = null;
      })
      .addCase(addServiceRequest.fulfilled, (state, action) => {
        state.loading.addServiceRequest = false;
        if (action.payload) {
          state.currentClient = action.payload;
        }
      })
      .addCase(addServiceRequest.rejected, (state, action) => {
        state.loading.addServiceRequest = false;
        state.errors.addServiceRequest = action.payload as string;
      });

    // Update service request status
    builder
      .addCase(updateServiceRequestStatus.pending, (state) => {
        state.loading.updateServiceRequestStatus = true;
        state.errors.updateServiceRequestStatus = null;
      })
      .addCase(updateServiceRequestStatus.fulfilled, (state, action) => {
        state.loading.updateServiceRequestStatus = false;
        if (action.payload.client) {
          state.currentClient = action.payload.client;
        }
      })
      .addCase(updateServiceRequestStatus.rejected, (state, action) => {
        state.loading.updateServiceRequestStatus = false;
        state.errors.updateServiceRequestStatus = action.payload as string;
      });

    // Fetch service request history
    builder
      .addCase(fetchServiceRequestHistory.pending, (state) => {
        state.loading.fetchServiceRequests = true;
        state.errors.fetchServiceRequests = null;
      })
      .addCase(fetchServiceRequestHistory.fulfilled, (state, action) => {
        state.loading.fetchServiceRequests = false;
        if (action.payload) {
          state.serviceRequests = action.payload.requests;
          state.serviceRequestsPagination.total = action.payload.total;
        }
      })
      .addCase(fetchServiceRequestHistory.rejected, (state, action) => {
        state.loading.fetchServiceRequests = false;
        state.errors.fetchServiceRequests = action.payload as string;
      });

    // Add service provider rating
    builder
      .addCase(addServiceProviderRating.pending, (state) => {
        state.loading.addRating = true;
        state.errors.addRating = null;
      })
      .addCase(addServiceProviderRating.fulfilled, (state, action) => {
        state.loading.addRating = false;
        if (action.payload) {
          state.currentClient = action.payload;
        }
      })
      .addCase(addServiceProviderRating.rejected, (state, action) => {
        state.loading.addRating = false;
        state.errors.addRating = action.payload as string;
      });

    // Fetch client stats
    builder
      .addCase(fetchClientStats.pending, (state) => {
        state.loading.fetchStats = true;
        state.errors.fetchStats = null;
      })
      .addCase(fetchClientStats.fulfilled, (state, action) => {
        state.loading.fetchStats = false;
        if (action.payload) {
          state.stats = action.payload;
        }
      })
      .addCase(fetchClientStats.rejected, (state, action) => {
        state.loading.fetchStats = false;
        state.errors.fetchStats = action.payload as string;
      });

    // Search clients by location
    builder
      .addCase(searchClientsByLocation.pending, (state) => {
        state.loading.searchClients = true;
        state.errors.searchClients = null;
      })
      .addCase(searchClientsByLocation.fulfilled, (state, action) => {
        state.loading.searchClients = false;
        if (action.payload) {
          state.searchResults = action.payload;
        }
      })
      .addCase(searchClientsByLocation.rejected, (state, action) => {
        state.loading.searchClients = false;
        state.errors.searchClients = action.payload as string;
      });

    // Batch update clients
    builder
      .addCase(batchUpdateClients.pending, (state) => {
        state.loading.batchUpdate = true;
        state.errors.batchUpdate = null;
      })
      .addCase(batchUpdateClients.fulfilled, (state) => {
        state.loading.batchUpdate = false;
        // Handle batch update results if needed
      })
      .addCase(batchUpdateClients.rejected, (state, action) => {
        state.loading.batchUpdate = false;
        state.errors.batchUpdate = action.payload as string;
      });

    // Fetch client with services
    builder
      .addCase(fetchClientWithServices.pending, (state) => {
        state.loading.fetchClient = true;
        state.errors.fetchClient = null;
      })
      .addCase(fetchClientWithServices.fulfilled, (state, action) => {
        state.loading.fetchClient = false;
        if (action.payload) {
          state.clientWithServices = action.payload;
        }
      })
      .addCase(fetchClientWithServices.rejected, (state, action) => {
        state.loading.fetchClient = false;
        state.errors.fetchClient = action.payload as string;
      });
  },
});

// Export actions
export const {
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
} = clientSlice.actions;

// Selectors
export const selectCurrentClient = (state: { client: ClientState }) => state.client.currentClient;
export const selectClientWithServices = (state: { client: ClientState }) => state.client.clientWithServices;
export const selectClients = (state: { client: ClientState }) => state.client.clients;
export const selectClientsPagination = (state: { client: ClientState }) => state.client.pagination;
export const selectServiceRequests = (state: { client: ClientState }) => state.client.serviceRequests;
export const selectClientStats = (state: { client: ClientState }) => state.client.stats;
export const selectSearchResults = (state: { client: ClientState }) => state.client.searchResults;
export const selectFilters = (state: { client: ClientState }) => state.client.filters;
export const selectClientLoading = (state: { client: ClientState }) => state.client.loading;
export const selectClientErrors = (state: { client: ClientState }) => state.client.errors;
export const selectSelectedClientId = (state: { client: ClientState }) => state.client.selectedClientId;
export const selectIsClientFormOpen = (state: { client: ClientState }) => state.client.isClientFormOpen;
export const selectIsServiceRequestFormOpen = (state: { client: ClientState }) => state.client.isServiceRequestFormOpen;
export const selectIsRatingFormOpen = (state: { client: ClientState }) => state.client.isRatingFormOpen;

// Computed selectors
export const selectClientById = (clientId: string) => (state: { client: ClientState }) =>
  state.client.clients.find(client => client._id.toString() === clientId);

export const selectCompletedServiceRequests = (state: { client: ClientState }) =>
  state.client.serviceRequests.filter(request => request.status === 'completed');

export const selectPendingServiceRequests = (state: { client: ClientState }) =>
  state.client.serviceRequests.filter(request => request.status === 'pending');

export const selectClientsByLocation = (region?: string, city?: string) => (state: { client: ClientState }) =>
  state.client.clients.filter(client => 
    (!region || client.location.region === region) &&
    (!city || client.location.city === city)
  );

export default clientSlice.reducer;