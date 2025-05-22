// categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "./type/serviceCategories";
import { ApiErrorResponse, AxiosError } from "./type/axios-types";

// Type definitions
interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

// API base URL
const API_BASE_URL = "/api/categories";

const handleError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return (
      axiosError.response?.data.message ||
      axiosError.message ||
      "An error occurred"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Category[]>(API_BASE_URL);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Category>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const createNewCategory = createAsyncThunk(
  "categories/create",
  async (data: Partial<Category>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Category>(API_BASE_URL, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateExistingCategory = createAsyncThunk(
  "categories/update",
  async (
    { id, data }: { id: string; data: Partial<Category> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Category>(`${API_BASE_URL}/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteExistingCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addNewSubcategory = createAsyncThunk(
  "categories/addSubcategory",
  async (
    {
      id,
      subcategoryData,
    }: { id: string; subcategoryData: { name: string; id?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<Category>(
        `${API_BASE_URL}/${id}/services`,
        subcategoryData
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateExistingSubcategory = createAsyncThunk(
  "categories/updateSubcategory",
  async (
    {
      id,
      subcategoryId,
      subcategoryData,
    }: {
      id: string;
      subcategoryId: string;
      subcategoryData: { name: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Category>(
        `${API_BASE_URL}/${id}/services/${subcategoryId}`,
        subcategoryData
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteExistingSubcategory = createAsyncThunk(
  "categories/deleteSubcategory",
  async (
    { id, serviceId }: { id: string; serviceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete<Category>(
        `${API_BASE_URL}/${id}/services/${serviceId}`
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCurrentCategory(state) {
      state.currentCategory = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoryById.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.currentCategory = action.payload;
        }
      )
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createNewCategory
      .addCase(createNewCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.push(action.payload);
          state.currentCategory = action.payload;
        }
      )
      .addCase(createNewCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateExistingCategory
      .addCase(updateExistingCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateExistingCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (cat) => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
          state.currentCategory = action.payload;
        }
      )
      .addCase(updateExistingCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleteExistingCategory
      .addCase(deleteExistingCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteExistingCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (cat) => cat.id !== action.payload
          );
          if (state.currentCategory?.id === action.payload) {
            state.currentCategory = null;
          }
        }
      )
      .addCase(deleteExistingCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Subcategory operations
      .addCase(
        addNewSubcategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          const index = state.categories.findIndex(
            (cat) => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
          state.currentCategory = action.payload;
        }
      )
      .addCase(
        updateExistingSubcategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          const index = state.categories.findIndex(
            (cat) => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
          state.currentCategory = action.payload;
        }
      )
      .addCase(
        deleteExistingSubcategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          const index = state.categories.findIndex(
            (cat) => cat.id === action.payload.id
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
          state.currentCategory = action.payload;
        }
      );
  },
});

export const { clearCurrentCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;
