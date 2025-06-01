// src/lib/api/categoryApi.ts
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/store/type/service-categories';
import { CategoryQueryOptions } from '@/lib/services/categoryService';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
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
   * Delete category by ID
   */
  static async deleteCategory(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete category');
    }

    const result: ApiResponse<{ deleted: boolean }> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete category');
    }

    return result.data.deleted;
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