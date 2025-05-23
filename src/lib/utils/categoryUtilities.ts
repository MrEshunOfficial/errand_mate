// src/lib/utils/categoryUtils.ts

import { Category } from "@/store/type/service-categories";

export class CategoryUtils {
  /**
   * Validate category name
   */
  static validateCategoryName(name: string): string | null {
    if (!name || name.trim().length === 0) {
      return "Category name is required";
    }
    if (name.trim().length < 2) {
      return "Category name must be at least 2 characters long";
    }
    if (name.trim().length > 50) {
      return "Category name must not exceed 50 characters";
    }
    return null;
  }

  /**
   * Validate category description
   */
  static validateCategoryDescription(description?: string): string | null {
    if (description && description.trim().length > 500) {
      return "Category description must not exceed 500 characters";
    }
    return null;
  }

  /**
   * Format category for display
   */
  static formatCategoryDisplay(category: Category): string {
    return `${category.name} (${category.serviceCount} services)`;
  }

  /**
   * Sort categories by multiple criteria
   */
  static sortCategories(
    categories: Category[],
    sortBy: "name" | "services" | "created" = "services",
    order: "asc" | "desc" = "desc"
  ): Category[] {
    return [...categories].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "services":
          comparison = (a.serviceCount ?? 0) - (b.serviceCount ?? 0);
          break;
        case "created":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return order === "asc" ? comparison : -comparison;
    });
  }

  /**
   * Filter categories by search term
   */
  static filterCategories(
    categories: Category[],
    searchTerm: string
  ): Category[] {
    if (!searchTerm.trim()) return categories;

    const term = searchTerm.toLowerCase().trim();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term)
    );
  }

  /**
   * Get category statistics
   */
  static getCategoryStats(categories: Category[]) {
    const totalCategories = categories.length;
    const totalServices = categories.reduce(
      (sum, cat) =>
        sum + (typeof cat.serviceCount === "number" ? cat.serviceCount : 0),
      0
    );
    const avgServicesPerCategory =
      totalCategories > 0 ? totalServices / totalCategories : 0;

    return {
      totalCategories,
      totalServices,
      avgServicesPerCategory: Math.round(avgServicesPerCategory * 100) / 100,
    };
  }

  /**
   * Check if category can be deleted
   */
  static canDeleteCategory(category: Category): {
    canDelete: boolean;
    reason?: string;
  } {
    if (
      typeof category.serviceCount === "number" &&
      category.serviceCount > 0
    ) {
      return {
        canDelete: false,
        reason: `Cannot delete category with ${category.serviceCount} existing services`,
      };
    }
    return { canDelete: true };
  }
}
