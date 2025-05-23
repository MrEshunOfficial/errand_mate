// src/lib/services/service.service.ts
import { Types } from "mongoose";
import { ServiceModel } from "@/models/category-service-models/serviceModel";
import {
  CreateServiceInput,
  PaginatedResponse,
  Service,
  ServiceFilters,
  UpdateServiceInput,
} from "@/store/type/service-categories";
import { connect } from "../dbconfigue/dbConfigue";

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

    if (filters.locations && filters.locations.length > 0) {
      query.locations = { $in: filters.locations };
    }

    if (filters.priceRange) {
      query["pricing.basePrice"] = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max,
      };
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
        .lean(),
      ServiceModel.countDocuments(query),
    ]);

    return {
      data: services as Service[],
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
    const service = await ServiceModel.findById(id).lean();
    return service as Service | null;
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
      .lean();
    return services as Service[];
  }

  static async createService(data: CreateServiceInput): Promise<Service> {
    await connect();

    // Validate category exists
    if (!Types.ObjectId.isValid(data.categoryId)) {
      throw new Error("Invalid category ID");
    }

    const service = new ServiceModel(data);
    await service.save();
    return service.toObject() as Service;
  }

  static async updateService(
    data: UpdateServiceInput
  ): Promise<Service | null> {
    await connect();
    if (!Types.ObjectId.isValid(data.id)) {
      return null;
    }

    const { id, ...updateData } = data;

    // Validate category if being updated
    if (
      updateData.categoryId &&
      !Types.ObjectId.isValid(updateData.categoryId)
    ) {
      throw new Error("Invalid category ID");
    }

    const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return service as Service | null;
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
    await service.save();
    return service.toObject() as Service;
  }

  static async getServicesByLocation(location: string): Promise<Service[]> {
    await connect();
    const services = await ServiceModel.find({
      locations: { $in: [location] },
      isActive: true,
    })
      .sort({ popular: -1, createdAt: -1 })
      .lean();
    return services as Service[];
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
      .lean();
    return services as Service[];
  }
}
