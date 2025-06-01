// src/store/slices/categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../type/service-categories';
import { CategoryQueryOptions, CategoryService } from '@/lib/services/categoryService';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
  filters: CategoryQueryOptions;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: Array<{
    _id: string;
    categoryName: string;
    serviceCount: number;
  }> | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
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

// Async Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (
    args: CategoryQueryOptions | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await CategoryService.getCategories(args);
      return response;
    }  catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to fetch category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async ({ id, includeServices }: { id: string; includeServices?: boolean }, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoryById(id, includeServices);
      return response;
    }  catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to get category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CreateCategoryInput, { rejectWithValue }) => {
    try {
      const response = await CategoryService.createCategory(categoryData);
      return response;
    }  catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to create category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: string; data: UpdateCategoryInput }, { rejectWithValue }) => {
    try {
      const response = await CategoryService.updateCategory(id, data);
      return response;
    }  catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to update category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await CategoryService.deleteCategory(id);
      if (!success) {
        throw new Error('Failed to delete category');
      }
      return id;
    }  catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to delete category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchCategories = createAsyncThunk(
  'categories/searchCategories',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await CategoryService.searchCategories(query);
      return response;
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to search category';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCategoriesWithCounts = createAsyncThunk(
  'categories/fetchCategoriesWithCounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoriesWithCounts();
      return response;
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'Failed to fetch category counts';
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CategoryQueryOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          hasNext: action.payload.page < action.payload.totalPages,
          hasPrev: action.payload.page > 1,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Category By ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.categories.unshift(action.payload);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.categories.findIndex(cat => cat._id === action.payload!._id);
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
          if (state.selectedCategory && state.selectedCategory._id === action.payload._id) {
            state.selectedCategory = action.payload;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat._id.toString() !== action.payload);
        if (state.selectedCategory && state.selectedCategory._id.toString() === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Categories
    builder
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Categories with Counts
    builder
      .addCase(fetchCategoriesWithCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCategoriesWithCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedCategory,
  clearError,
  resetState,
} = categorySlice.actions;

export default categorySlice.reducer;
