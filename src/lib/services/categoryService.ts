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
   * Delete category by ID
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid category ID');
      }

      // Check if category has associated services
      const serviceCount = await ServiceModel?.countDocuments({ categoryId: id }) ?? 0;
      if (serviceCount > 0) {
        throw new Error('Cannot delete category with associated services');
      }

      const result = await CategoryModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete category: ${error.message}`);
      }
      throw new Error('Failed to delete category');
    }
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