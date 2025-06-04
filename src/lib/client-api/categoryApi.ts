// src/lib/api/categoryApi.ts
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/store/type/service-categories';
import { CategoryQueryOptions, DeleteCategoryOptions } from '@/lib/services/categoryService';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

interface DeleteCategoryResponse {
  success: boolean;
  message: string;
  deletedServicesCount?: number;
  migratedServicesCount?: number;
}

interface CategoryDeletionInfo {
  categoryName: string;
  serviceCount: number;
  services: Array<{ _id: string; title: string; }>;
  canDeleteSafely: boolean;
}

interface BulkDeleteResult {
  successful: string[];
  failed: Array<{ id: string; error: string; }>;
  totalDeleted: number;
  totalServicesMigrated: number;
  totalServicesDeleted: number;
}

export class CategoryApi {
  private static baseUrl = '/api/categories';

  /**
   * Get all categories with filtering and pagination
   */
  static async getCategories(options: CategoryQueryOptions = {}): Promise<{
    categories: Category[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams();
    
    if (options.page) searchParams.set('page', options.page.toString());
    if (options.limit) searchParams.set('limit', options.limit.toString());
    if (options.sortBy) searchParams.set('sortBy', options.sortBy);
    if (options.sortOrder) searchParams.set('sortOrder', options.sortOrder);
    if (options.search) searchParams.set('search', options.search);
    if (options.tags?.length) searchParams.set('tags', options.tags.join(','));
    if (options.includeServices) searchParams.set('includeServices', 'true');

    const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch categories');
    }

    const result: ApiResponse<{
      categories: Category[];
      total: number;
      page: number;
      totalPages: number;
    }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch categories');
    }

    return result.data;
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string, includeServices: boolean = false): Promise<Category | null> {
    const searchParams = new URLSearchParams();
    if (includeServices) searchParams.set('includeServices', 'true');

    const response = await fetch(`${this.baseUrl}/${id}?${searchParams.toString()}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get category');
    }

    const result: ApiResponse<Category> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get category');
    }

    return result.data;
  }

  /**
   * Create a new category
   */
  static async createCategory(input: CreateCategoryInput): Promise<Category> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create category');
    }

    const result: ApiResponse<Category> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create category');
    }

    return result.data;
  }

  /**
   * Update category by ID
   */
  static async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update category');
    }

    const result: ApiResponse<Category> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update category');
    }

    return result.data;
  }

  /**
   * Delete category by ID with advanced options
   */
  static async deleteCategory(id: string, options: DeleteCategoryOptions = {}): Promise<DeleteCategoryResponse> {
    const searchParams = new URLSearchParams();
    
    // Add options as query parameters
    if (options.force) searchParams.set('force', 'true');
    if (options.cascade) searchParams.set('cascade', 'true');
    if (options.createDefault) searchParams.set('createDefault', 'true');
    if (options.migrateTo) searchParams.set('migrateTo', options.migrateTo);

    const response = await fetch(`${this.baseUrl}/${id}?${searchParams.toString()}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options), // Also send options in body (takes precedence)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete category');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete category');
    }

    return {
      success: result.success,
      message: result.message,
      deletedServicesCount: result.deletedServicesCount,
      migratedServicesCount: result.migratedServicesCount,
    };
  }

  /**
   * Simple delete - will fail if category has services (safest option)
   */
  static async simpleDeleteCategory(id: string): Promise<DeleteCategoryResponse> {
    return this.deleteCategory(id, {});
  }

  /**
   * Safe delete - moves services to "Uncategorized" category
   */
  static async safeDeleteCategory(id: string): Promise<DeleteCategoryResponse> {
    return this.deleteCategory(id, { createDefault: true });
  }

  /**
   * Cascade delete - deletes category and all its services (DESTRUCTIVE)
   */
  static async cascadeDeleteCategory(id: string): Promise<DeleteCategoryResponse> {
    return this.deleteCategory(id, { cascade: true });
  }

  /**
   * Migrate delete - moves services to another category, then deletes
   */
  static async migrateDeleteCategory(id: string, targetCategoryId: string): Promise<DeleteCategoryResponse> {
    return this.deleteCategory(id, { migrateTo: targetCategoryId });
  }

  /**
   * Force delete - deletes category regardless of services (DANGEROUS)
   */
  static async forceDeleteCategory(id: string): Promise<DeleteCategoryResponse> {
    return this.deleteCategory(id, { force: true });
  }

  /**
   * Get category deletion preview info
   */
  static async getCategoryDeletionInfo(id: string): Promise<CategoryDeletionInfo> {
    const response = await fetch(`${this.baseUrl}/${id}/deletion-info`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get deletion info');
    }

    const result: ApiResponse<CategoryDeletionInfo> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get deletion info');
    }

    return result.data;
  }

  /**
   * Bulk delete categories
   */
  static async bulkDeleteCategories(
    categoryIds: string[],
    options: DeleteCategoryOptions = {}
  ): Promise<BulkDeleteResult> {
    const response = await fetch(`${this.baseUrl}/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryIds,
        options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to bulk delete categories');
    }

    const result: ApiResponse<BulkDeleteResult> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to bulk delete categories');
    }

    return result.data;
  }

  /**
   * Search categories
   */
  static async searchCategories(query: string): Promise<Category[]> {
    const searchParams = new URLSearchParams({ search: query });
    
    const response = await fetch(`${this.baseUrl}/search?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search categories');
    }

    const result: ApiResponse<Category[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to search categories');
    }

    return result.data;
  }

  /**
   * Get categories with service counts
   */
  static async getCategoriesWithCounts(): Promise<Array<{
    _id: string;
    categoryName: string;
    serviceCount: number;
  }>> {
    const response = await fetch(`${this.baseUrl}/stats`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get category counts');
    }

    const result: ApiResponse<Array<{
      _id: string;
      categoryName: string;
      serviceCount: number;
    }>> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get category counts');
    }

    return result.data;
  }
}