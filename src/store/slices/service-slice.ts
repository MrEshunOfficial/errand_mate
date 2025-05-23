// src/store/slices/servicesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { ServicesApi, GetServicesParams } from "../../lib/api/services.api";
import {
  Service,
  ServiceFilters,
  CreateServiceInput,
  UpdateServiceInput,
} from "../type/service-categories";

interface ServicesState {
  services: Service[];
  currentService: Service | null;
  popularServices: Service[];
  searchResults: Service[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: ServiceFilters;
  loading: {
    services: boolean;
    currentService: boolean;
    popularServices: boolean;
    search: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    toggleStatus: boolean;
  };
  error: {
    services: string | null;
    currentService: string | null;
    popularServices: string | null;
    search: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
    toggleStatus: string | null;
  };
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  popularServices: [],
  searchResults: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  },
  filters: {},
  loading: {
    services: false,
    currentService: false,
    popularServices: false,
    search: false,
    create: false,
    update: false,
    delete: false,
    toggleStatus: false,
  },
  error: {
    services: null,
    currentService: null,
    popularServices: null,
    search: null,
    create: null,
    update: null,
    delete: null,
    toggleStatus: null,
  },
};

// Async thunks
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (params: GetServicesParams = {}) => {
    const response = await ServicesApi.getServices(params);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch services");
    }
    return { ...response.data!, params };
  }
);

export const fetchServiceById = createAsyncThunk(
  "services/fetchServiceById",
  async ({
    id,
    withCategory = false,
  }: {
    id: string;
    withCategory?: boolean;
  }) => {
    const response = await ServicesApi.getServiceById(id, withCategory);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch service");
    }
    return response.data!;
  }
);

export const fetchPopularServices = createAsyncThunk<
  Service[], // return type
  number | undefined // argument type
>("services/fetchPopularServices", async (limit = 10) => {
  const response = await ServicesApi.getPopularServices(limit);
  if (!response.success) {
    throw new Error(response.error || "Failed to fetch popular services");
  }
  return response.data!;
});

export const searchServices = createAsyncThunk(
  "services/searchServices",
  async ({ query, limit = 20 }: { query: string; limit?: number }) => {
    const response = await ServicesApi.searchServices(query, limit);
    if (!response.success) {
      throw new Error(response.error || "Failed to search services");
    }
    return response.data!;
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async (data: CreateServiceInput) => {
    const response = await ServicesApi.createService(data);
    if (!response.success) {
      throw new Error(response.error || "Failed to create service");
    }
    return response.data!;
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async (data: UpdateServiceInput) => {
    const response = await ServicesApi.updateService(data);
    if (!response.success) {
      throw new Error(response.error || "Failed to update service");
    }
    return response.data!;
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id: string) => {
    const response = await ServicesApi.deleteService(id);
    if (!response.success) {
      throw new Error(response.error || "Failed to delete service");
    }
    return id;
  }
);

export const toggleServiceStatus = createAsyncThunk(
  "services/toggleServiceStatus",
  async (id: string) => {
    const response = await ServicesApi.toggleServiceStatus(id);
    if (!response.success) {
      throw new Error(response.error || "Failed to toggle service status");
    }
    return response.data!;
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ServiceFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentService: (state) => {
      state.currentService = null;
      state.error.currentService = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error.search = null;
    },
    clearErrors: (state) => {
      Object.keys(state.error).forEach((key) => {
        state.error[key as keyof typeof state.error] = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Fetch Services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading.services = true;
        state.error.services = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading.services = false;
        state.services = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          hasNext: action.payload.hasNext,
          hasPrev: action.payload.hasPrev,
        };
        if (action.payload.params) {
          state.filters = action.payload.params;
        }
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading.services = false;
        state.error.services =
          action.error.message || "Failed to fetch services";
      });

    // Fetch Service by ID
    builder
      .addCase(fetchServiceById.pending, (state) => {
        state.loading.currentService = true;
        state.error.currentService = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading.currentService = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading.currentService = false;
        state.error.currentService =
          action.error.message || "Failed to fetch service";
      });

    // Fetch Popular Services
    builder
      .addCase(fetchPopularServices.pending, (state) => {
        state.loading.popularServices = true;
        state.error.popularServices = null;
      })
      .addCase(fetchPopularServices.fulfilled, (state, action) => {
        state.loading.popularServices = false;
        state.popularServices = action.payload;
      })
      .addCase(fetchPopularServices.rejected, (state, action) => {
        state.loading.popularServices = false;
        state.error.popularServices =
          action.error.message || "Failed to fetch popular services";
      });

    // Search Services
    builder
      .addCase(searchServices.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search =
          action.error.message || "Failed to search services";
      });

    // Create Service
    builder
      .addCase(createService.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading.create = false;
        state.services.unshift(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message || "Failed to create service";
      });

    // Update Service
    builder
      .addCase(updateService.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.services.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentService?.id === action.payload.id) {
          state.currentService = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message || "Failed to update service";
      });

    // Delete Service
    builder
      .addCase(deleteService.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.services = state.services.filter((s) => s.id !== action.payload);
        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.error.message || "Failed to delete service";
      });

    // Toggle Service Status
    builder
      .addCase(toggleServiceStatus.pending, (state) => {
        state.loading.toggleStatus = true;
        state.error.toggleStatus = null;
      })
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        state.loading.toggleStatus = false;
        const index = state.services.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentService?.id === action.payload.id) {
          state.currentService = action.payload;
        }
      })
      .addCase(toggleServiceStatus.rejected, (state, action) => {
        state.loading.toggleStatus = false;
        state.error.toggleStatus =
          action.error.message || "Failed to toggle service status";
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentService,
  clearSearchResults,
  clearErrors,
} = servicesSlice.actions;

export default servicesSlice.reducer;
