// src/services/category.service.ts
import { CategoryModel, ICategoryLean } from "@/models/category-service-models/categoryModel";
import ServiceModel from "@/models/category-service-models/serviceModel";
import { Category } from "@/store/type/service-categories";
import { Types } from "mongoose";

export interface CreateCategoryInput {
  categoryName: string;
  description?: string;
  catImage?: {
    url: string;
    catName: string;
  };
  tags?: string[];
}

export interface UpdateCategoryInput {
  categoryName?: string;
  description?: string;
  catImage?: {
    url: string;
    catName: string;
  };
  tags?: string[];
}

export interface DeleteCategoryOptions {
  force?: boolean;           // Force delete even with associated services
  cascade?: boolean;         // Delete associated services too
  migrateTo?: string;       // Move services to another category
  createDefault?: boolean;  // Create "Uncategorized" and move services there
}

export interface CategoryQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'serviceCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  tags?: string[];
  includeServices?: boolean;
}

export class CategoryService {
  /**
   * Create a new category
   */
  static async createCategory(input: CreateCategoryInput): Promise<Category> {
    try {
      const existingCategory = await CategoryModel.findOne({
        categoryName: { $regex: new RegExp(`^${input.categoryName}$`, 'i') }
      });

      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      const category = new CategoryModel(input);
      const savedCategory = await category.save();
      
      return CategoryModel.transformLeanToCategory(savedCategory.toObject());
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create category: ${error.message}`);
      }
      throw new Error('Failed to create category');
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(
    id: string, 
    includeServices: boolean = false
  ): Promise<Category | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid category ID');
      }

      let query = CategoryModel.findById(id);
      
      if (includeServices) {
        query = query.populate('services');
      }

      const category = await query.lean<ICategoryLean>();
      
      if (!category) {
        return null;
      }

      return CategoryModel.transformLeanToCategory(category);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get category: ${error.message}`);
      }
      throw new Error('Failed to get category');
    }
  }

  /**
   * Get all categories with filtering and pagination
   */
  static async getCategories(options: CategoryQueryOptions = {}): Promise<{
    categories: Category[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        tags,
        includeServices = false
      } = options;

      // Build filter query
      const filter: Record<string, unknown> = {};

      if (search) {
        filter.$or = [
          { categoryName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (tags && tags.length > 0) {
        filter.tags = { $in: tags };
      }

      // Build sort object
      const sortOptions: Record<string, 1 | -1> = {};
      switch (sortBy) {
        case 'name':
          sortOptions.categoryName = sortOrder === 'asc' ? 1 : -1;
          break;
        case 'serviceCount':
          sortOptions.serviceCount = sortOrder === 'asc' ? 1 : -1;
          break;
        default:
          sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
      }

      const skip = (page - 1) * limit;

      let query = CategoryModel.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      if (includeServices) {
        query = query.populate('services');
      }

      const [categories, total] = await Promise.all([
        query.lean<ICategoryLean[]>(),
        CategoryModel.countDocuments(filter)
      ]);

      const transformedCategories = categories.map(cat => 
        CategoryModel.transformLeanToCategory(cat)
      );

      return {
        categories: transformedCategories,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get categories: ${error.message}`);
      }
      throw new Error('Failed to get categories');
    }
  }

  /**
   * Update category by ID
   */
  static async updateCategory(
    id: string, 
    input: UpdateCategoryInput
  ): Promise<Category | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid category ID');
      }

      // Check for duplicate name if categoryName is being updated
      if (input.categoryName) {
        const existingCategory = await CategoryModel.findOne({
          _id: { $ne: id },
          categoryName: { $regex: new RegExp(`^${input.categoryName}$`, 'i') }
        });

        if (existingCategory) {
          throw new Error('Category with this name already exists');
        }
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).lean<ICategoryLean>();

      if (!updatedCategory) {
        return null;
      }

      return CategoryModel.transformLeanToCategory(updatedCategory);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update category: ${error.message}`);
      }
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete category by ID with multiple handling options for associated services
   */
  static async deleteCategory(
    id: string, 
    options: DeleteCategoryOptions = {}
  ): Promise<{ 
    success: boolean; 
    deletedServicesCount?: number; 
    migratedServicesCount?: number; 
    message?: string;
  }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid category ID');
      }

      const { force = false, cascade = false, migrateTo, createDefault = false } = options;

      // Check if category exists
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      // Check for associated services
      const serviceCount = await ServiceModel?.countDocuments({ categoryId: id }) ?? 0;
      
      if (serviceCount > 0) {
        if (cascade) {
          // Delete all associated services
          const deleteResult = await ServiceModel?.deleteMany({ categoryId: id });
          const deletedCount = deleteResult?.deletedCount ?? 0;
          
          // Then delete the category
          await CategoryModel.findByIdAndDelete(id);
          
          return {
            success: true,
            deletedServicesCount: deletedCount,
            message: `Category deleted along with ${deletedCount} associated services`
          };
          
        } else if (migrateTo) {
          // Migrate services to another category
          const migratedCount = await this.migrateServices(id, migrateTo);
          
          // Then delete the category
          await CategoryModel.findByIdAndDelete(id);
          
          return {
            success: true,
            migratedServicesCount: migratedCount,
            message: `Category deleted and ${migratedCount} services migrated`
          };
          
        } else if (createDefault) {
          // Create/get default category and migrate
          const defaultCategoryId = await this.getOrCreateDefaultCategory();
          const migratedCount = await this.migrateServices(id, defaultCategoryId);
          
          // Then delete the category
          await CategoryModel.findByIdAndDelete(id);
          
          return {
            success: true,
            migratedServicesCount: migratedCount,
            message: `Category deleted and ${migratedCount} services moved to 'Uncategorized'`
          };
          
        } else if (force) {
          // Force delete without handling services (dangerous!)
          await CategoryModel.findByIdAndDelete(id);
          
          return {
            success: true,
            message: `Category force deleted. ${serviceCount} services now have invalid category references!`
          };
          
        } else {
          // Default behavior - prevent deletion
          throw new Error(
            `Cannot delete category with ${serviceCount} associated services. ` +
            'Use one of these options: cascade, migrateTo, createDefault, or force'
          );
        }
      } else {
        // No associated services, safe to delete
        await CategoryModel.findByIdAndDelete(id);
        return {
          success: true,
          message: 'Category deleted successfully'
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete category: ${error.message}`);
      }
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Cascade delete - delete category and all associated services
   */
  static async cascadeDeleteCategory(id: string): Promise<{ 
    success: boolean; 
    deletedServicesCount: number; 
  }> {
    const result = await this.deleteCategory(id, { cascade: true });
    return {
      success: result.success,
      deletedServicesCount: result.deletedServicesCount ?? 0
    };
  }

  /**
   * Safe delete - migrate services to default category then delete
   */
  static async safeDeleteCategory(id: string): Promise<{ 
    success: boolean; 
    migratedServicesCount: number; 
  }> {
    const result = await this.deleteCategory(id, { createDefault: true });
    return {
      success: result.success,
      migratedServicesCount: result.migratedServicesCount ?? 0
    };
  }

  /**
   * Force delete - delete category regardless of associated services (DANGEROUS)
   */
  static async forceDeleteCategory(id: string): Promise<boolean> {
    const result = await this.deleteCategory(id, { force: true });
    return result.success;
  }

  /**
   * Helper: Migrate services from one category to another
   */
  private static async migrateServices(fromCategoryId: string, toCategoryId: string): Promise<number> {
    try {
      if (!Types.ObjectId.isValid(toCategoryId)) {
        throw new Error('Invalid target category ID');
      }

      // Verify target category exists
      const targetCategory = await CategoryModel.findById(toCategoryId);
      if (!targetCategory) {
        throw new Error('Target category not found');
      }

      // Migrate services
      const migrateResult = await ServiceModel?.updateMany(
        { categoryId: fromCategoryId },
        { $set: { categoryId: toCategoryId } }
      );

      return migrateResult?.modifiedCount ?? 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to migrate services: ${error.message}`);
      }
      throw new Error('Failed to migrate services');
    }
  }

  /**
   * Helper: Get or create default "Uncategorized" category
   */
  private static async getOrCreateDefaultCategory(): Promise<string> {
    try {
      const defaultCategory = await CategoryModel.findOneAndUpdate(
        { categoryName: { $regex: /^uncategorized$/i } }, // Case-insensitive search
        { 
          categoryName: 'Uncategorized',
          description: 'Default category for services without a specific category',
          tags: ['default', 'system']
        },
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true 
        }
      );
      
      return defaultCategory._id.toString();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get/create default category: ${error.message}`);
      }
      throw new Error('Failed to get/create default category');
    }
  }

  /**
   * Get category deletion info (preview what will happen)
   */
  static async getCategoryDeletionInfo(id: string): Promise<{
    categoryName: string;
    serviceCount: number;
    services: Array<{ _id: string; title: string; }>;
    canDeleteSafely: boolean;
  }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid category ID');
      }

      const category = await CategoryModel.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      interface ServiceLean {
        _id: Types.ObjectId | string;
        title: string;
      }

      const services = await ServiceModel?.find({ categoryId: id })
        .select('_id title')
        .lean<ServiceLean[]>() ?? [];

      return {
        categoryName: category.categoryName,
        serviceCount: services.length,
        services: services.map(s => ({ _id: (s._id as Types.ObjectId | string).toString(), title: s.title })),
        canDeleteSafely: services.length === 0
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get deletion info: ${error.message}`);
      }
      throw new Error('Failed to get deletion info');
    }
  }

  /**
   * Bulk delete categories with different strategies
   */
  static async bulkDeleteCategories(
    categoryIds: string[],
    options: DeleteCategoryOptions = {}
  ): Promise<{
    successful: string[];
    failed: Array<{ id: string; error: string; }>;
    totalDeleted: number;
    totalServicesMigrated: number;
    totalServicesDeleted: number;
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as Array<{ id: string; error: string; }>,
      totalDeleted: 0,
      totalServicesMigrated: 0,
      totalServicesDeleted: 0
    };

    for (const id of categoryIds) {
      try {
        const result = await this.deleteCategory(id, options);
        if (result.success) {
          results.successful.push(id);
          results.totalDeleted++;
          results.totalServicesMigrated += result.migratedServicesCount ?? 0;
          results.totalServicesDeleted += result.deletedServicesCount ?? 0;
        }
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }


  /**
   * Get categories with service counts
   */
  static async getCategoriesWithCounts(): Promise<Array<{
    _id: string;
    categoryName: string;
    serviceCount: number;
  }>> {
    try {
      return await CategoryModel.aggregate([
        {
          $project: {
            categoryName: 1,
            serviceCount: 1
          }
        },
        {
          $sort: { serviceCount: -1 }
        }
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get category counts: ${error.message}`);
      }
      throw new Error('Failed to get category counts');
    }
  }

  /**
   * Search categories by name or tags
   */
  static async searchCategories(query: string): Promise<Category[]> {
    try {
      const categories = await CategoryModel.find({
        $or: [
          { categoryName: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      }).lean<ICategoryLean[]>();

      return categories.map(cat => CategoryModel.transformLeanToCategory(cat));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search categories: ${error.message}`);
      }
      throw new Error('Failed to search categories');
    }
  }
}