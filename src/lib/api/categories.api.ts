import axios from "axios";
import {
  Category,
  CategoryWithServices,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/store/type/service-categories";

// Define custom API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios response interceptor for error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error || "Unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export class CategoriesApi {
  /**
   * Get all categories
   */
  static async getAllCategories(withServices = false): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(
      `/categoryApi${withServices ? "?withServices=true" : ""}`
    );

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch categories");
    }

    return data.data;
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(
    id: string,
    withServices = false
  ): Promise<Category | CategoryWithServices> {
    const { data } = await apiClient.get<
      ApiResponse<Category | CategoryWithServices>
    >(`/categoryApi/${id}${withServices ? "?withServices=true" : ""}`);

    if (!data.success || !data.data) {
      throw new Error(data.error || "Category not found");
    }

    return data.data;
  }

  /**
   * Create a new category
   */
  static async createCategory(
    dataInput: CreateCategoryInput
  ): Promise<Category> {
    const { data } = await apiClient.post<ApiResponse<Category>>(
      "/categoryApi",
      dataInput
    );

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to create category");
    }

    return data.data;
  }

  /**
   * Update a category
   */
  static async updateCategory(
    dataInput: UpdateCategoryInput
  ): Promise<Category> {
    const { id, ...updateData } = dataInput;
    const { data } = await apiClient.put<ApiResponse<Category>>(
      `/categoryApi/${id}`,
      updateData
    );

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to update category");
    }

    return data.data;
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/categoryApi/${id}`
    );

    if (!data.success) {
      throw new Error(data.error || "Failed to delete category");
    }
  }
}
