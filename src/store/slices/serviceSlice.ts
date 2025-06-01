// src/store/slices/serviceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';
import { IServiceDocument } from '@/models/category-service-models/serviceModel';
import { ServiceQueryOptions, ServiceService } from '@/lib/services/serviceServices';
import { CreateServiceInput, UpdateServiceInput } from '../type/service-categories';

// Define proper response types
interface ServicesResponse {
  services: IServiceDocument[];
  total: number;
  page: number;
  totalPages: number;
}

interface ServiceState {
  services: IServiceDocument[];
  popularServices: IServiceDocument[];
  selectedService: IServiceDocument | null;
  loading: boolean;
  error: string | null;
  filters: ServiceQueryOptions;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    total: number;
    active: number;
    popular: number;
    byCategory: Array<{ categoryName: string; count: number }>;
  } | null;
}

const initialState: ServiceState = {
  services: [],
  popularServices: [],
  selectedService: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  stats: null,
};

// Helper function to convert Mongoose documents to plain objects
const convertToPlainObject = (doc: unknown): IServiceDocument => {
  if (doc && typeof doc === 'object' && 'toObject' in doc && typeof doc.toObject === 'function') {
    return doc.toObject() as IServiceDocument;
  }
  return doc as IServiceDocument;
};

// Helper function to safely convert array of documents
const convertArrayToPlainObjects = (docs: unknown[]): IServiceDocument[] => {
  return docs.map(convertToPlainObject);
};

// Async Thunks
export const fetchServices = createAsyncThunk<
  ServicesResponse,
  ServiceQueryOptions | undefined,
  { rejectValue: string }
>(
  'services/fetchServices',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await ServiceService.getServices(filters);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch services';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchServiceById = createAsyncThunk<
  IServiceDocument | null,
  { id: string; includeCategory?: boolean },
  { rejectValue: string }
>(
  'services/fetchServiceById',
  async ({ id, includeCategory }, { rejectWithValue }) => {
    try {
      const response = await ServiceService.getServiceById(id, includeCategory);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch service';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createService = createAsyncThunk<
  IServiceDocument,
  CreateServiceInput,
  { rejectValue: string }
>(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await ServiceService.createService(serviceData);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create service';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateService = createAsyncThunk<
  IServiceDocument,
  { id: string; data: UpdateServiceInput },
  { rejectValue: string }
>(
  'services/updateService',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ServiceService.updateService(id, data);
      if (!response) {
        return rejectWithValue('Service not found');
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update service';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteService = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      const success = await ServiceService.deleteService(id);
      if (!success) {
        throw new Error('Failed to delete service');
      }
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete service';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleServicePopular = createAsyncThunk<
  IServiceDocument,
  string,
  { rejectValue: string }
>(
  'services/toggleServicePopular',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ServiceService.togglePopular(id);
      if (!response) {
        return rejectWithValue('Service not found');
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle service popularity';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleServiceActive = createAsyncThunk<
  IServiceDocument,
  string,
  { rejectValue: string }
>(
  'services/toggleServiceActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ServiceService.toggleActive(id);
      if (!response) {
        return rejectWithValue('Service not found');
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle service active status';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPopularServices = createAsyncThunk<
  IServiceDocument[],
  { limit?: number },
  { rejectValue: string }
>(
  'services/fetchPopularServices',
  async ({ limit }, { rejectWithValue }) => {
    try {
      const response = await ServiceService.getPopularServices(limit);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch popular services';
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchServices = createAsyncThunk<
  IServiceDocument[],
  string,
  { rejectValue: string }
>(
  'services/searchServices',
  async (query, { rejectWithValue }) => {
    try {
      const response = await ServiceService.searchServices(query);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search services';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchServiceStats = createAsyncThunk<
  ServiceState['stats'],
  void,
  { rejectValue: string }
>(
  'services/fetchServiceStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ServiceService.getServiceStats();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch service stats';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchServicesByCategory = createAsyncThunk<
  IServiceDocument[],
  string,
  { rejectValue: string }
>(
  'services/fetchServicesByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await ServiceService.getServicesByCategory(categoryId);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch services by category';
      return rejectWithValue(errorMessage);
    }
  }
);

// Helper function to update service in array
const updateServiceInArray = (
  services: Draft<IServiceDocument>[],
  updatedService: IServiceDocument
): void => {
  const index = services.findIndex(service => service._id === updatedService._id);
  if (index !== -1) {
    services[index] = convertToPlainObject(updatedService) as Draft<IServiceDocument>;
  }
};

// Slice
export const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ServiceQueryOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedService: (state, action: PayloadAction<IServiceDocument | null>) => {
      state.selectedService = action.payload ? convertToPlainObject(action.payload) as Draft<IServiceDocument> : null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        const plainServices = convertArrayToPlainObjects(action.payload.services);
        state.services = plainServices as Draft<IServiceDocument>[];

        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          hasNext: action.payload.page < action.payload.totalPages,
          hasPrev: action.payload.page > 1,
        };
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch services';
      });

    // Fetch Service By ID
    builder
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const plainService = convertToPlainObject(action.payload);
          state.selectedService = plainService as Draft<IServiceDocument>;
        } else {
          state.selectedService = null;
        }
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch service';
      });

    // Create Service
    builder
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        const plainService = convertToPlainObject(action.payload);
        state.services.unshift(plainService as Draft<IServiceDocument>);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create service';
      });

    // Update Service
    builder
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const updatedService = action.payload;
        
        updateServiceInArray(state.services, updatedService);
        
        if (state.selectedService && state.selectedService._id === updatedService._id) {
          state.selectedService = convertToPlainObject(updatedService) as Draft<IServiceDocument>;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to update service';
      });

    // Delete Service
    builder
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.services = state.services.filter(service => 
          String(service._id) !== deletedId
        ) as Draft<IServiceDocument>[];
        
        if (state.selectedService && String(state.selectedService._id) === deletedId) {
          state.selectedService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete service';
      });

    // Toggle Service Popular
    builder
      .addCase(toggleServicePopular.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleServicePopular.fulfilled, (state, action) => {
        state.loading = false;
        const updatedService = action.payload;
        
        updateServiceInArray(state.services, updatedService);
        
        if (state.selectedService && state.selectedService._id === updatedService._id) {
          state.selectedService = convertToPlainObject(updatedService) as Draft<IServiceDocument>;
        }
      })
      .addCase(toggleServicePopular.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to toggle service popularity';
      });

    // Toggle Service Active
    builder
      .addCase(toggleServiceActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleServiceActive.fulfilled, (state, action) => {
        state.loading = false;
        const updatedService = action.payload;
        
        updateServiceInArray(state.services, updatedService);
        
        if (state.selectedService && state.selectedService._id === updatedService._id) {
          state.selectedService = convertToPlainObject(updatedService) as Draft<IServiceDocument>;
        }
      })
      .addCase(toggleServiceActive.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to toggle service active status';
      });

    // Fetch Popular Services
    builder
      .addCase(fetchPopularServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularServices.fulfilled, (state, action) => {
        state.loading = false;
        const plainServices = convertArrayToPlainObjects(action.payload);
        state.popularServices = plainServices as Draft<IServiceDocument>[];
      })
      .addCase(fetchPopularServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch popular services';
      });

    // Search Services
    builder
      .addCase(searchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading = false;
        const plainServices = convertArrayToPlainObjects(action.payload);
        state.services = plainServices as Draft<IServiceDocument>[];
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search services';
      });

    // Fetch Service Stats
    builder
      .addCase(fetchServiceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchServiceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch service stats';
      });

    // Fetch Services By Category
    builder
      .addCase(fetchServicesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const plainServices = convertArrayToPlainObjects(action.payload);
        state.services = plainServices as Draft<IServiceDocument>[];
      })
      .addCase(fetchServicesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch services by category';
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedService,
  clearError,
  resetState,
} = serviceSlice.actions;

export default serviceSlice.reducer;