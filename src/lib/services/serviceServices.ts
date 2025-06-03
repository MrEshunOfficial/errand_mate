// src/services/service.service.ts
import { CategoryModel } from "@/models/category-service-models/categoryModel";
import ServiceModel, { IServiceDocument } from "@/models/category-service-models/serviceModel";
import { Types } from "mongoose";

export interface CreateServiceInput {
  title: string;
  description: string;
  categoryId: string;
  serviceImage?: {
    url: string;
    serviceName: string;
  };
  popular?: boolean;
  isActive?: boolean;
  tags?: string[];
}

export interface UpdateServiceInput {
  title?: string;
  description?: string;
  categoryId?: string;
  serviceImage?: {
    url: string;
    serviceName: string;
  };
  popular?: boolean;
  isActive?: boolean;
  tags?: string[];
}

export interface ServiceQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'popular' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  popular?: boolean;
  tags?: string[];
  includeCategory?: boolean;
}

export class ServiceService {
  /**
   * Create a new service
   */
  static async createService(input: CreateServiceInput): Promise<IServiceDocument> {
    try {
      // Validate category exists
      if (!Types.ObjectId.isValid(input.categoryId)) {
        throw new Error('Invalid category ID');
      }

      const categoryExists = await CategoryModel.findById(input.categoryId);
      if (!categoryExists) {
        throw new Error('Category not found');
      }

      const service = new ServiceModel!(input);
      return await service.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create service: ${error.message}`);
      }
      throw new Error('Failed to create service');
    }
  }

  /**
   * Get service by ID
   */
  static async getServiceById(
    id: string, 
    includeCategory: boolean = false
  ): Promise<IServiceDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid service ID');
      }

      let query = ServiceModel?.findById(id);
      
      if (includeCategory) {
        query = query?.populate('category');
      }

      return await query?.exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get service: ${error.message}`);
      }
      throw new Error('Failed to get service');
    }
  }

  /**
   * Get all services with filtering and pagination
   */
  static async getServices(options: ServiceQueryOptions = {}): Promise<{
    services: IServiceDocument[];
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
        categoryId,
        isActive,
        popular,
        tags,
        includeCategory = false
      } = options;

      // Build filter query
      const filter: Record<string, unknown> = {};

      if (search) {
        filter.$text = { $search: search };
      }

      if (categoryId) {
        if (!Types.ObjectId.isValid(categoryId)) {
          throw new Error('Invalid category ID');
        }
        filter.categoryId = categoryId;
      }

      if (typeof isActive === 'boolean') {
        filter.isActive = isActive;
      }

      if (typeof popular === 'boolean') {
        filter.popular = popular;
      }

      if (tags && tags.length > 0) {
        filter.tags = { $in: tags };
      }

      // Build sort object
      const sortOptions: Record<string, 1 | -1> = {};
      switch (sortBy) {
        case 'title':
          sortOptions.title = sortOrder === 'asc' ? 1 : -1;
          break;
        case 'popular':
          sortOptions.popular = sortOrder === 'asc' ? 1 : -1;
          break;
        default:
          sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
      }

      const skip = (page - 1) * limit;

      let query = ServiceModel?.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      if (includeCategory) {
        query = query?.populate('category');
      }

      const [servicesRaw, totalRaw] = await Promise.all([
        query?.exec(),
        ServiceModel?.countDocuments(filter)
      ]);

      const services: IServiceDocument[] = servicesRaw ?? [];
      const total: number = totalRaw ?? 0;

      return {
        services,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get services: ${error.message}`);
      }
      throw new Error('Failed to get services');
    }
  }

  /**
   * Update service by ID
   */
  static async updateService(
    id: string, 
    input: UpdateServiceInput
  ): Promise<IServiceDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid service ID');
      }

      // Validate category if being updated
      if (input.categoryId) {
        if (!Types.ObjectId.isValid(input.categoryId)) {
          throw new Error('Invalid category ID');
        }

        const categoryExists = await CategoryModel.findById(input.categoryId);
        if (!categoryExists) {
          throw new Error('Category not found');
        }
      }

      return await ServiceModel?.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update service: ${error.message}`);
      }
      throw new Error('Failed to update service');
    }
  }

  /**
   * Delete service by ID
   */
  static async deleteService(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid service ID');
      }

      const result = await ServiceModel?.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete service: ${error.message}`);
      }
      throw new Error('Failed to delete service');
    }
  }

 /**
 * Get services by category - FIXED: Shows both active and inactive services
 */
static async getServicesByCategory(categoryId: string): Promise<IServiceDocument[]> {
  try {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error('Invalid category ID');
    }

    const services = await ServiceModel?.find({ 
      categoryId
      // Removed isActive: true filter to show all services
    }).sort({ popular: -1, createdAt: -1 }).exec() ?? [];
    return services;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get services by category: ${error.message}`);
    }
    throw new Error('Failed to get services by category');
  }
}

/**
 * Get popular services - FIXED: Shows both active and inactive popular services
 */
static async getPopularServices(limit: number = 10): Promise<IServiceDocument[]> {
  try {
    const services = await ServiceModel?.find({ 
      popular: true
      // Removed isActive: true filter to show all popular services
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category')
    .exec();
    return services ?? [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get popular services: ${error.message}`);
    }
    throw new Error('Failed to get popular services');
  }
}
  /**
   * Search services
   */
  static async searchServices(query: string): Promise<IServiceDocument[]> {
    try {
      const results = await ServiceModel?.find({
        $text: { $search: query },
        isActive: true
      })
      .sort({ score: { $meta: 'textScore' } })
      .populate('category')
      .exec();
      return results ?? [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search services: ${error.message}`);
      }
      throw new Error('Failed to search services');
    }
  }

  /**
   * Toggle service popularity
   */
  static async togglePopular(id: string): Promise<IServiceDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid service ID');
      }

      const service = await ServiceModel?.findById(id);
      if (!service) {
        throw new Error('Service not found');
      }

      service.popular = !service.popular;
      return await service.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to toggle service popularity: ${error.message}`);
      }
      throw new Error('Failed to toggle service popularity');
    }
  }

  /**
   * Toggle service active status
   */
  static async toggleActive(id: string): Promise<IServiceDocument | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid service ID');
      }

      const service = await ServiceModel?.findById(id);
      if (!service) {
        throw new Error('Service not found');
      }

      service.isActive = !service.isActive;
      return await service.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to toggle service status: ${error.message}`);
      }
      throw new Error('Failed to toggle service status');
    }
  }

  /**
   * Get service statistics
   */
  static async getServiceStats(): Promise<{
    total: number;
    active: number;
    popular: number;
    byCategory: Array<{ categoryName: string; count: number }>;
  }> {
    try {
      const [total, active, popular, byCategory] = await Promise.all([
        ServiceModel?.countDocuments(),
        ServiceModel?.countDocuments({ isActive: true }),
        ServiceModel?.countDocuments({ popular: true }),
        ServiceModel?.aggregate([
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category'
            }
          },
          {
            $unwind: '$category'
          },
          {
            $group: {
              _id: '$category._id',
              categoryName: { $first: '$category.categoryName' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { count: -1 }
          }
        ])
      ]);

      return {
        total: total ?? 0,
        active: active ?? 0,
        popular: popular ?? 0,
        byCategory: (byCategory ?? []) as { categoryName: string; count: number }[]
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get service statistics: ${error.message}`);
      }
      throw new Error('Failed to get service statistics');
    }
  }
}