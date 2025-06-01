// src/hooks/useCategories.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
  fetchCategoriesWithCounts,
  setFilters,
  clearFilters,
  setSelectedCategory,
  clearError,
  resetState,
} from '../store/slices/categorySlice';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/store/type/service-categories';
import { CategoryQueryOptions } from '@/lib/services/categoryService';

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    categories,
    selectedCategory,
    loading,
    error,
    filters,
    pagination,
    stats,
  } = useSelector((state: RootState) => state.categories);

  // Fetch all categories with optional filters
  const getCategories = useCallback(
    (options?: CategoryQueryOptions) => {
      return dispatch(fetchCategories(options));
    },
    [dispatch]
  );

  // Fetch a single category by ID
  const getCategoryById = useCallback(
    (id: string, includeServices?: boolean) => {
      return dispatch(fetchCategoryById({ id, includeServices }));
    },
    [dispatch]
  );

  // Create a new category
  const addCategory = useCallback(
    (categoryData: CreateCategoryInput) => {
      return dispatch(createCategory(categoryData));
    },
    [dispatch]
  );

  const editCategory = useCallback(
    (id: string, data: UpdateCategoryInput) => {
      return dispatch(updateCategory({ id, data }));
    },
    [dispatch]
  );

  // Delete a category
  const removeCategory = useCallback(
    (id: string) => {
      return dispatch(deleteCategory(id));
    },
    [dispatch]
  );

  // Search categories
  const searchCategoriesByQuery = useCallback(
    (query: string) => {
      return dispatch(searchCategories(query));
    },
    [dispatch]
  );

  // Fetch categories with service counts
  const getCategoriesWithCounts = useCallback(() => {
    return dispatch(fetchCategoriesWithCounts());
  }, [dispatch]);

  // Set filters
  const updateFilters = useCallback(
    (newFilters: Partial<CategoryQueryOptions>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  // Clear filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Set selected category
  const selectCategory = useCallback(
    (category: Category | null) => {
      dispatch(setSelectedCategory(category));
    },
    [dispatch]
  );

  // Clear error
  const clearCategoryError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset state
  const resetCategoryState = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    // State
    categories,
    selectedCategory,
    loading,
    error,
    filters,
    pagination,
    stats,
    
    // Actions
    getCategories,
    getCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    searchCategoriesByQuery,
    getCategoriesWithCounts,
    updateFilters,
    resetFilters,
    selectCategory,
    clearCategoryError,
    resetCategoryState,
  };
};