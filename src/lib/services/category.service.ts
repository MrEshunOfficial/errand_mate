// src/lib/services/category.service.ts - Fixed implementation with proper typing
import { Types } from "mongoose";
import { CategoryModel, ICategoryLean } from "@/models/category-service-models/categoryModel";
import {
  Category,
  CategoryWithServices,
  Service,
  ServicePricing,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/store/type/service-categories";
import { connect } from "../dbconfigue/dbConfigue";

// MongoDB document interfaces
interface MongoServiceDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  longDescription?: string;
  categoryId: Types.ObjectId;
  icon?: string;
  pricing: ServicePricing;
  locations: string[];
  popular: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MongoCategoryWithServicesDocument {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  serviceCount?: number;
  serviceIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  services?: MongoServiceDocument[];
}

export class CategoryService {
  // Helper method to ensure ServiceModel is imported when needed
  private static async ensureServiceModel(): Promise<void> {
    try {
      await import("@/models/category-service-models/serviceModel");
    } catch (error) {
      console.warn("ServiceModel import failed:", error);
    }
  }

  // Helper method to transform MongoDB service document to Service interface
  private static transformMongoServiceToService(serviceDoc: MongoServiceDocument): Service {
    return {
      id: serviceDoc._id.toString(),
      title: serviceDoc.title,
      description: serviceDoc.description,
      longDescription: serviceDoc.longDescription,
      categoryId: serviceDoc.categoryId.toString(),
      icon: serviceDoc.icon,
      pricing: serviceDoc.pricing,
      popular: serviceDoc.popular,
      isActive: serviceDoc.isActive,
      tags: serviceDoc.tags,
      createdAt: serviceDoc.createdAt,
      updatedAt: serviceDoc.updatedAt,
    };
  }

  // Helper method to transform MongoDB document to CategoryWithServices
  private static transformToCategoryWithServices(doc: MongoCategoryWithServicesDocument): CategoryWithServices {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      icon: doc.icon,
      serviceCount: doc.services?.length || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      services: (doc.services || []).map(service => 
        this.transformMongoServiceToService(service)
      ),
    };
  }

  static async getAllCategories(): Promise<Category[]> {
    await connect();
    const categories = await CategoryModel.find({})
      .sort({ serviceCount: -1, name: 1 })
      .lean<ICategoryLean[]>();
   
    return categories.map(CategoryModel.transformLeanToCategory);
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const category = await CategoryModel.findById(id).lean<ICategoryLean>();
    return category ? CategoryModel.transformLeanToCategory(category) : null;
  }

  static async getCategoryWithServices(id: string): Promise<CategoryWithServices | null> {
    await connect();
    // Ensure ServiceModel is loaded for population
    await this.ensureServiceModel();
    
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
   
    try {
      const category = await CategoryModel.findById(id)
        .populate({
          path: "services",
          match: { isActive: true },
          options: { sort: { popular: -1, createdAt: -1 } },
        })
        .lean<MongoCategoryWithServicesDocument>();
     
      if (!category) {
        return null;
      }

      // Transform the MongoDB document to CategoryWithServices
      return this.transformToCategoryWithServices(category);
    } catch (error) {
      console.error("Error in getCategoryWithServices:", error);
      throw error;
    }
  }

  static async createCategory(data: CreateCategoryInput): Promise<Category> {
    await connect();
    const category = new CategoryModel(data);
    const savedCategory = await category.save();
    // Using toObject() here which triggers the transform
    return CategoryModel.transformLeanToCategory(savedCategory.toObject());
  }

  static async updateCategory(
    data: UpdateCategoryInput
  ): Promise<Category | null> {
    await connect();
    if (!Types.ObjectId.isValid(data.id)) {
      return null;
    }
    const { id, ...updateData } = data;
    const category = await CategoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean<ICategoryLean>();
   
    return category ? CategoryModel.transformLeanToCategory(category) : null;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    // Check if category has services
    const category = await CategoryModel.findById(id);
    if (!category) return false;
    if ((category?.serviceCount ?? 0) > 0) {
      throw new Error("Cannot delete category with existing services");
    }
    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }

  static async getCategoriesWithServiceCount(): Promise<Category[]> {
    await connect();
    // Ensure ServiceModel is loaded for aggregation
    await this.ensureServiceModel();
    
    const categories = await CategoryModel.aggregate<Category>([
      {
        $lookup: {
          from: "services", // Make sure this matches your Service collection name
          localField: "_id",
          foreignField: "categoryId",
          as: "services",
          pipeline: [{ $match: { isActive: true } }],
        },
      },
      {
        $addFields: {
          serviceCount: { $size: "$services" },
        },
      },
      {
        $project: {
          services: 0,
          __v: 0,
        },
      },
      {
        $addFields: {
          id: { $toString: "$_id" },
          serviceIds: {
            $map: {
              input: "$serviceIds",
              as: "serviceId",
              in: { $toString: "$$serviceId" }
            }
          },
        },
      },
      {
        $unset: "_id",
      },
      {
        $sort: { serviceCount: -1, name: 1 },
      },
    ]);
    return categories;
  }
}