// src/hooks/useCategories.ts
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  clearSelectedCategory,
  setSelectedCategory,
} from "@/store/slices/category-slice";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  Category,
  CategoryWithServices,
} from "@/store/type/service-categories";
import { useCallback, useEffect, useRef } from "react";

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    selectedCategory,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    lastFetched,
  } = useAppSelector((state) => state.categories);

  // Use ref to track if initial fetch has been attempted
  const initialFetchAttempted = useRef(false);

  // Auto-fetch categories if not fetched recently (5 minutes cache)
  useEffect(() => {
    const shouldFetch =
      !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;

    if (
      shouldFetch &&
      categories.length === 0 &&
      !loading &&
      !initialFetchAttempted.current
    ) {
      initialFetchAttempted.current = true;
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, lastFetched, loading]);

  // Fetch all categories - remove lastFetched from dependencies to prevent infinite loops
  const loadCategories = useCallback(
    (withServices = false, force = false) => {
      // Get current lastFetched value from the selector state
      const currentLastFetched = lastFetched;
      const shouldFetch =
        force ||
        !currentLastFetched ||
        Date.now() - currentLastFetched > 5 * 60 * 1000;

      if (shouldFetch) {
        dispatch(fetchCategories(withServices));
      }
    },
    [dispatch] // Remove lastFetched from dependencies
  );

  // Fetch single category
  const loadCategory = useCallback(
    (id: string, withServices = false) => {
      dispatch(fetchCategoryById({ id, withServices }));
    },
    [dispatch]
  );

  // Create category
  const handleCreateCategory = useCallback(
    async (data: CreateCategoryInput) => {
      const result = await dispatch(createCategory(data));
      if (createCategory.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload as string);
    },
    [dispatch]
  );

  // Update category
  const handleUpdateCategory = useCallback(
    async (data: UpdateCategoryInput) => {
      const result = await dispatch(updateCategory(data));
      if (updateCategory.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload as string);
    },
    [dispatch]
  );

  // Delete category
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteCategory(id));
      if (deleteCategory.fulfilled.match(result)) {
        return true;
      }
      throw new Error(result.payload as string);
    },
    [dispatch]
  );

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear selected category
  const handleClearSelectedCategory = useCallback(() => {
    dispatch(clearSelectedCategory());
  }, [dispatch]);

  // Set selected category
  const handleSetSelectedCategory = useCallback(
    (category: Category | CategoryWithServices) => {
      dispatch(setSelectedCategory(category));
    },
    [dispatch]
  );

  // Get category by id from current state
  const getCategoryById = useCallback(
    (id: string): Category | undefined => {
      return categories.find((cat) => cat.id === id);
    },
    [categories]
  );

  // Get categories sorted by service count
  const getCategoriesByServiceCount = useCallback((): Category[] => {
    return [...categories].sort(
      (a, b) => (b.serviceCount ?? 0) - (a.serviceCount ?? 0)
    );
  }, [categories]);

  return {
    // State
    categories,
    selectedCategory,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    lastFetched,

    // Actions
    loadCategories,
    loadCategory,
    createCategory: handleCreateCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    clearError: handleClearError,
    clearSelectedCategory: handleClearSelectedCategory,
    setSelectedCategory: handleSetSelectedCategory,

    // Utility functions
    getCategoryById,
    getCategoriesByServiceCount,
  };
};
