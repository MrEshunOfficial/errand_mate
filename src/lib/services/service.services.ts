// src/lib/services/service.service.ts
import { Types } from "mongoose";
import {
  CreateServiceInput,
  PaginatedResponse,
  Service,
  ServiceFilters,
  UpdateServiceInput,
} from "@/store/type/service-categories";
import { connect } from "../dbconfigue/dbConfigue";
import { ServiceModel } from "@/models/category-service-models/serviceModel";

export class ServiceService {
  static async getAllServices(
    page: number = 1,
    limit: number = 10,
    filters: ServiceFilters = {}
  ): Promise<PaginatedResponse<Service>> {
    await connect();

    const query: Record<string, unknown> = {};

    // Apply filters
    if (filters.categoryId) {
      if (!Types.ObjectId.isValid(filters.categoryId)) {
        throw new Error("Invalid category ID");
      }
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.popular !== undefined) {
      query.popular = filters.popular;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      ServiceModel.find(query)
        .sort(
          filters.search
            ? { score: { $meta: "textScore" } }
            : { popular: -1, createdAt: -1 }
        )
        .skip(skip)
        .limit(limit)
        .lean<Service[]>(), // Proper typing with lean
      ServiceModel.countDocuments(query),
    ]);

    return {
      data: services,
      total,
      page,
      limit,
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    };
  }

  static async getServiceById(id: string): Promise<Service | null> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const service = await ServiceModel.findById(id).lean<Service>();
    return service;
  }

  static async getServiceWithCategory(id: string) {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const service = await ServiceModel.findById(id)
      .populate("category", "id name icon")
      .lean();
    return service;
  }

  static async getServicesByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ) {
    await connect();
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid category ID");
    }

    return this.getAllServices(page, limit, { categoryId, isActive: true });
  }

  static async getPopularServices(limit: number = 10): Promise<Service[]> {
    await connect();
    const services = await ServiceModel.find({ popular: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<Service[]>();
    return services;
  }

  static async createService(data: CreateServiceInput): Promise<Service> {
    await connect();

    // Validate category exists
    if (!Types.ObjectId.isValid(data.categoryId)) {
      throw new Error("Invalid category ID");
    }

    const service = new ServiceModel(data);
    const savedService = await service.save();
    return savedService.toObject() as Service;
  }

  static async updateService(
    data: UpdateServiceInput
  ): Promise<Service | null> {
    await connect();
    if (!Types.ObjectId.isValid(data.id)) {
      return null;
    }

    const { id, ...updateData } = data;
    if (
      updateData.categoryId &&
      !Types.ObjectId.isValid(updateData.categoryId)
    ) {
      throw new Error("Invalid category ID");
    }

    const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean<Service>();
    return service;
  }

  static async deleteService(id: string): Promise<boolean> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await ServiceModel.findByIdAndDelete(id);
    return !!result;
  }

  static async toggleServiceStatus(id: string): Promise<Service | null> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const service = await ServiceModel.findById(id);
    if (!service) return null;

    service.isActive = !service.isActive;
    const savedService = await service.save();
    return savedService.toObject() as Service;
  }

  static async getServicesByLocation(location: string): Promise<Service[]> {
    await connect();
    const services = await ServiceModel.find({
      locations: { $in: [location] },
      isActive: true,
    })
      .sort({ popular: -1, createdAt: -1 })
      .lean<Service[]>();
    return services;
  }

  static async searchServices(
    query: string,
    limit: number = 20
  ): Promise<Service[]> {
    await connect();
    const services = await ServiceModel.find({
      $text: { $search: query },
      isActive: true,
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean<Service[]>();
    return services;
  }
}