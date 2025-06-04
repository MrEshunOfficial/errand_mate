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
  simpleDeleteCategory,
  safeDeleteCategory,
  cascadeDeleteCategory,
  migrateDeleteCategory,
  forceDeleteCategory,
  getCategoryDeletionInfo,
  bulkDeleteCategories,
  searchCategories,
  fetchCategoriesWithCounts,
  setFilters,
  clearFilters,
  setSelectedCategory,
  clearError,
  clearDeletionInfo,
  clearBulkDeleteResult,
  resetState,
} from '../store/slices/categorySlice';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/store/type/service-categories';
import { CategoryQueryOptions, DeleteCategoryOptions } from '@/lib/services/categoryService';

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
    deletionInfo,
    bulkDeleteResult,
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

  // Generic delete with options
  const removeCategory = useCallback(
    (id: string, options?: DeleteCategoryOptions) => {
      return dispatch(deleteCategory({ id, options }));
    },
    [dispatch]
  );

  // Specific delete operations
  const removeCategorySimple = useCallback(
    (id: string) => {
      return dispatch(simpleDeleteCategory(id));
    },
    [dispatch]
  );

  const removeCategorySafely = useCallback(
    (id: string) => {
      return dispatch(safeDeleteCategory(id));
    },
    [dispatch]
  );

  const removeCategoryCascade = useCallback(
    (id: string) => {
      return dispatch(cascadeDeleteCategory(id));
    },
    [dispatch]
  );

  const removeCategoryWithMigration = useCallback(
    (id: string, targetCategoryId: string) => {
      return dispatch(migrateDeleteCategory({ id, targetCategoryId }));
    },
    [dispatch]
  );

  const removeCategoryForce = useCallback(
    (id: string) => {
      return dispatch(forceDeleteCategory(id));
    },
    [dispatch]
  );

  // Get deletion info for preview
  const getDeletionInfo = useCallback(
    (id: string) => {
      return dispatch(getCategoryDeletionInfo(id));
    },
    [dispatch]
  );

  // Bulk delete categories
  const removeCategoriesBulk = useCallback(
    (categoryIds: string[], options?: DeleteCategoryOptions) => {
      return dispatch(bulkDeleteCategories({ categoryIds, options }));
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

  // Refresh both categories and counts - useful after service operations
  const refreshCategoriesData = useCallback(async (options?: CategoryQueryOptions) => {
    await Promise.all([
      dispatch(fetchCategories(options || { limit: 50 })),
      dispatch(fetchCategoriesWithCounts())
    ]);
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

  // Clear deletion info
  const clearCategoryDeletionInfo = useCallback(() => {
    dispatch(clearDeletionInfo());
  }, [dispatch]);

  // Clear bulk delete result
  const clearCategoryBulkDeleteResult = useCallback(() => {
    dispatch(clearBulkDeleteResult());
  }, [dispatch]);

  // Reset state
  const resetCategoryState = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  // Helper to get service count for a specific category
  const getServiceCount = useCallback((categoryId: string): number => {
    const stat = stats?.find(s => s._id === categoryId);
    return stat?.serviceCount || 0;
  }, [stats]);

  // Helper to check if category can be safely deleted
  const canDeleteSafely = useCallback((categoryId: string): boolean => {
    return getServiceCount(categoryId) === 0;
  }, [getServiceCount]);

  // Helper to find categories with no services
  const getEmptyCategories = useCallback((): Category[] => {
    if (!stats) return [];
    const emptyCategoryIds = stats.filter(s => s.serviceCount === 0).map(s => s._id.toString());
    return categories.filter(cat => emptyCategoryIds.includes(cat._id.toString()));
  }, [categories, stats]);

  // Helper to find categories with services
  const getCategoriesWithServices = useCallback((): Category[] => {
    if (!stats) return [];
    const nonEmptyCategoryIds = stats.filter(s => s.serviceCount > 0).map(s => s._id.toString());
    return categories.filter(cat => nonEmptyCategoryIds.includes(cat._id.toString()));
  }, [categories, stats]);

  // Helper to get deletion summary
  const getDeletionSummary = useCallback(() => {
    if (!deletionInfo) return null;
    
    return {
      categoryName: deletionInfo.categoryName,
      serviceCount: deletionInfo.serviceCount,
      canDeleteSafely: deletionInfo.canDeleteSafely,
      affectedServices: deletionInfo.services,
      recommendedAction: deletionInfo.canDeleteSafely 
        ? 'simple' 
        : deletionInfo.serviceCount > 0 
          ? 'migrate' 
          : 'safe'
    };
  }, [deletionInfo]);

  // Helper to get bulk delete summary
  const getBulkDeleteSummary = useCallback(() => {
    if (!bulkDeleteResult) return null;
    
    return {
      totalAttempted: bulkDeleteResult.successful.length + bulkDeleteResult.failed.length,
      successful: bulkDeleteResult.successful.length,
      failed: bulkDeleteResult.failed.length,
      totalDeleted: bulkDeleteResult.totalDeleted,
      totalServicesMigrated: bulkDeleteResult.totalServicesMigrated,
      totalServicesDeleted: bulkDeleteResult.totalServicesDeleted,
      failedCategories: bulkDeleteResult.failed,
      successRate: Math.round((bulkDeleteResult.successful.length / (bulkDeleteResult.successful.length + bulkDeleteResult.failed.length)) * 100)
    };
  }, [bulkDeleteResult]);

  return {
    // State
    categories,
    selectedCategory,
    loading,
    error,
    filters,
    pagination,
    stats,
    deletionInfo,
    bulkDeleteResult,
        
    // Basic CRUD Actions
    getCategories,
    getCategoryById,
    addCategory,
    editCategory,
    removeCategory,
    
    // Specific Delete Actions
    removeCategorySimple,
    removeCategorySafely,
    removeCategoryCascade,
    removeCategoryWithMigration,
    removeCategoryForce,
    getDeletionInfo,
    removeCategoriesBulk,
    
    // Other Actions
    searchCategoriesByQuery,
    getCategoriesWithCounts,
    refreshCategoriesData,
    updateFilters,
    resetFilters,
    selectCategory,
    clearCategoryError,
    clearCategoryDeletionInfo,
    clearCategoryBulkDeleteResult,
    resetCategoryState,
    
    // Helper Methods
    getServiceCount,
    canDeleteSafely,
    getEmptyCategories,
    getCategoriesWithServices,
    getDeletionSummary,
    getBulkDeleteSummary,
  };
};