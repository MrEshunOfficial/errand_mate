// src/store/slices/categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { CategoriesApi } from "../../lib/api/categories.api";
import {
  Category,
  CategoryWithServices,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../type/service-categories";

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | CategoryWithServices | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  lastFetched: number | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  lastFetched: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk<
  Category[], // return type
  boolean | undefined, // argument type
  { rejectValue: string } // thunkAPI config
>(
  "categories/fetchCategories",
  async (withServices = false, { rejectWithValue }) => {
    try {
      const categories = await CategoriesApi.getAllCategories(withServices);
      return categories;
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch categories";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCategoryById = createAsyncThunk<
  Category | CategoryWithServices, // return type
  { id: string; withServices?: boolean }, // argument type
  { rejectValue: string } // thunkAPI config
>(
  "categories/fetchCategoryById",
  async ({ id, withServices = false }, { rejectWithValue }) => {
    try {
      const category = await CategoriesApi.getCategoryById(id, withServices);
      return category;
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch category";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const createCategory = createAsyncThunk<
  Category, // return type
  CreateCategoryInput, // argument type
  { rejectValue: string } // thunkAPI config
>("categories/createCategory", async (data, { rejectWithValue }) => {
  try {
    const category = await CategoriesApi.createCategory(data);
    return category;
  } catch (error: unknown) {
    let errorMessage = "Failed to create category";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue(errorMessage);
  }
});

export const updateCategory = createAsyncThunk<
  Category, // return type
  UpdateCategoryInput, // argument type
  { rejectValue: string } // thunkAPI config
>("categories/updateCategory", async (data, { rejectWithValue }) => {
  try {
    const category = await CategoriesApi.updateCategory(data);
    return category;
  } catch (error: unknown) {
    let errorMessage = "Failed to update category";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue(errorMessage);
  }
});

export const deleteCategory = createAsyncThunk<
  string, // return type
  string, // argument type (id)
  { rejectValue: string } // thunkAPI configuration
>("categories/deleteCategory", async (id: string, { rejectWithValue }) => {
  try {
    await CategoriesApi.deleteCategory(id);
    return id;
  } catch (error: unknown) {
    let errorMessage = "Failed to delete category";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return rejectWithValue(errorMessage);
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setSelectedCategory: (
      state,
      action: PayloadAction<Category | CategoryWithServices>
    ) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch category by ID
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

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.categories.push(action.payload);
        // Sort categories by serviceCount (desc) then name (asc)
        state.categories.sort((a, b) => {
          if (b.serviceCount !== a.serviceCount) {
            return (b?.serviceCount ?? 0) - (a?.serviceCount ?? 0);
          }
          return a.name.localeCompare(b.name);
        });
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    // Update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = {
            ...state.selectedCategory,
            ...action.payload,
          };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedCategory, setSelectedCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
