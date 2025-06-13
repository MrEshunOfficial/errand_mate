// src/services/providerService.ts
import ServiceProviderModel from "@/models/client_provider_models/providerModel";
import {
  ServiceProviderData,
  CreateProviderInput,
  ProviderDataWithServices,
  UpdateProviderInput,
  ProviderServiceRequest,
  ProviderRating,
  WitnessDetails,
} from "@/store/type/client_provider_Data";
import mongoose, { Types, FilterQuery } from "mongoose";

interface LocationQuery {
  "location.region"?: RegExp;
  "location.city"?: RegExp;
  "location.district"?: RegExp;
}

interface SearchQuery {
  $or: Array<{
    fullName?: { $regex: string; $options: string };
    "contactDetails.email"?: { $regex: string; $options: string };
  }>;
}

interface PaginationFilters {
  region?: string;
  city?: string;
  serviceId?: string;
  minRating?: number;
}

interface PaginatedResult {
  providers: ServiceProviderData[];
  totalPages: number;
  currentPage: number;
  totalProviders: number;
}

interface ProviderStats {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  cancelledRequests: number;
  averageRating: number;
  totalRatings: number;
}

export class ProviderService {
  /**
   * Create a new service provider
   */
  static async createProvider(
    providerData: CreateProviderInput
  ): Promise<ServiceProviderData> {
    try {
      const provider = new ServiceProviderModel(providerData);
      const savedProvider = await provider.save();
      return savedProvider.toObject();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(
          `Validation error: ${Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")}`
        );
      }
      if (
        error instanceof mongoose.Error &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new Error("Provider with this userId or email already exists");
      }
      throw new Error(
        `Failed to create provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get provider by userId
   */
  static async getProviderByUserId(
    userId: string
  ): Promise<ServiceProviderData | null> {
    try {
      const provider = await ServiceProviderModel.findOne({ userId }).lean();
      return provider;
    } catch (error) {
      throw new Error(
        `Failed to get provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get provider by MongoDB _id
   */
  static async getProviderById(
    id: string | Types.ObjectId
  ): Promise<ServiceProviderData | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid provider ID format");
      }

      const provider = await ServiceProviderModel.findById(id).lean();
      return provider;
    } catch (error) {
      throw new Error(
        `Failed to get provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get provider with populated services
   */
  static async getProviderWithServices(
    userId: string
  ): Promise<ProviderDataWithServices | null> {
    try {
      const provider = await ServiceProviderModel.findOne({ userId })
        .populate({
          path: "serviceRendering",
          select: "title category",
          populate: {
            path: "category",
            select: "categoryName catImage",
          },
        })
        .populate({
          path: "serviceHistory.serviceId",
          select: "title category",
          populate: {
            path: "category",
            select: "categoryName",
          },
        })
        .lean();

      return provider as unknown as ProviderDataWithServices;
    } catch (error) {
      throw new Error(
        `Failed to get provider with services: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update provider information
   */
  static async updateProvider(
    updateData: UpdateProviderInput
  ): Promise<ServiceProviderData | null> {
    try {
      const { _id, ...updateFields } = updateData;

      if (!Types.ObjectId.isValid(_id)) {
        throw new Error("Invalid provider ID format");
      }

      const updatedProvider = await ServiceProviderModel.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).lean();

      return updatedProvider;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(
          `Validation error: ${Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")}`
        );
      }
      throw new Error(
        `Failed to update provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete provider
   */
  static async deleteProvider(id: string | Types.ObjectId): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid provider ID format");
      }

      const result = await ServiceProviderModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(
        `Failed to delete provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get providers by service type
   */
  static async getProvidersByService(
    serviceId: string | Types.ObjectId
  ): Promise<ServiceProviderData[]> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid service ID format");
      }

      const providers = await ServiceProviderModel.find({
        serviceRendering: serviceId,
      }).lean();

      return providers;
    } catch (error) {
      throw new Error(
        `Failed to get providers by service: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get providers by location
   */
  static async getProvidersByLocation(
    region?: string,
    city?: string,
    district?: string
  ): Promise<ServiceProviderData[]> {
    try {
      const query: LocationQuery = {};

      if (region) query["location.region"] = new RegExp(region, "i");
      if (city) query["location.city"] = new RegExp(city, "i");
      if (district) query["location.district"] = new RegExp(district, "i");

      const providers = await ServiceProviderModel.find(query).lean();
      return providers;
    } catch (error) {
      throw new Error(
        `Failed to get providers by location: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Search providers by name or services
   */
  static async searchProviders(
    searchTerm: string
  ): Promise<ServiceProviderData[]> {
    try {
      const query: SearchQuery = {
        $or: [
          { fullName: { $regex: searchTerm, $options: "i" } },
          { "contactDetails.email": { $regex: searchTerm, $options: "i" } },
        ],
      };

      const providers = await ServiceProviderModel.find(query).lean();
      return providers;
    } catch (error) {
      throw new Error(
        `Failed to search providers: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Add service request to provider's history
   */
  static async addServiceRequest(
    providerId: string | Types.ObjectId,
    serviceRequest: Omit<ProviderServiceRequest, "requestId">
  ): Promise<ServiceProviderData | null> {
    try {
      if (!Types.ObjectId.isValid(providerId)) {
        throw new Error("Invalid provider ID format");
      }

      const newRequest: ProviderServiceRequest = {
        ...serviceRequest,
        requestId: new Types.ObjectId(),
      };

      const updatedProvider = await ServiceProviderModel.findByIdAndUpdate(
        providerId,
        { $push: { serviceHistory: newRequest } },
        { new: true, runValidators: true }
      ).lean();

      return updatedProvider;
    } catch (error) {
      throw new Error(
        `Failed to add service request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update service request status
   */
  static async updateServiceRequestStatus(
    providerId: string | Types.ObjectId,
    requestId: string | Types.ObjectId,
    status: "pending" | "in-progress" | "completed" | "cancelled"
  ): Promise<ServiceProviderData | null> {
    try {
      if (
        !Types.ObjectId.isValid(providerId) ||
        !Types.ObjectId.isValid(requestId)
      ) {
        throw new Error("Invalid ID format");
      }

      const updatedProvider = await ServiceProviderModel.findOneAndUpdate(
        {
          _id: providerId,
          "serviceHistory.requestId": requestId,
        },
        {
          $set: { "serviceHistory.$.status": status },
        },
        { new: true, runValidators: true }
      ).lean();

      return updatedProvider;
    } catch (error) {
      throw new Error(
        `Failed to update service request status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Add client rating to provider
   */
  static async addClientRating(
    providerId: string | Types.ObjectId,
    rating: ProviderRating
  ): Promise<ServiceProviderData | null> {
    try {
      if (!Types.ObjectId.isValid(providerId)) {
        throw new Error("Invalid provider ID format");
      }

      const updatedProvider = await ServiceProviderModel.findByIdAndUpdate(
        providerId,
        { $push: { clientRating: rating } },
        { new: true, runValidators: true }
      ).lean();

      return updatedProvider;
    } catch (error) {
      throw new Error(
        `Failed to add client rating: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get provider's average rating
   */
  static async getProviderAverageRating(
    providerId: string | Types.ObjectId
  ): Promise<number> {
    try {
      if (!Types.ObjectId.isValid(providerId)) {
        throw new Error("Invalid provider ID format");
      }

      const result = await ServiceProviderModel.aggregate([
        { $match: { _id: new Types.ObjectId(providerId) } },
        { $unwind: "$clientRating" },
        {
          $group: {
            _id: "$_id",
            averageRating: { $avg: "$clientRating.rating" },
            totalRatings: { $sum: 1 },
          },
        },
      ]);

      return result.length > 0
        ? Math.round(result[0].averageRating * 10) / 10
        : 0;
    } catch (error) {
      throw new Error(
        `Failed to get provider average rating: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get provider's service statistics
   */
  static async getProviderStats(
    providerId: string | Types.ObjectId
  ): Promise<ProviderStats> {
    try {
      if (!Types.ObjectId.isValid(providerId)) {
        throw new Error("Invalid provider ID format");
      }

      const provider = await ServiceProviderModel.findById(providerId).lean();

      if (!provider) {
        throw new Error("Provider not found");
      }

      const serviceHistory = provider.serviceHistory || [];
      const clientRating = provider.clientRating || [];

      const stats: ProviderStats = {
        totalRequests: serviceHistory.length,
        completedRequests: serviceHistory.filter(
          (req) => req.status === "completed"
        ).length,
        pendingRequests: serviceHistory.filter(
          (req) => req.status === "pending"
        ).length,
        cancelledRequests: serviceHistory.filter(
          (req) => req.status === "cancelled"
        ).length,
        averageRating:
          clientRating.length > 0
            ? Math.round(
                (clientRating.reduce((sum, rating) => sum + rating.rating, 0) /
                  clientRating.length) *
                  10
              ) / 10
            : 0,
        totalRatings: clientRating.length,
      };

      return stats;
    } catch (error) {
      throw new Error(
        `Failed to get provider stats: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Add or update witness details
   */
  static async updateWitnessDetails(
    providerId: string | Types.ObjectId,
    witnessDetails: WitnessDetails[]
  ): Promise<ServiceProviderData | null> {
    try {
      if (!Types.ObjectId.isValid(providerId)) {
        throw new Error("Invalid provider ID format");
      }

      const updatedProvider = await ServiceProviderModel.findByIdAndUpdate(
        providerId,
        { $set: { witnessDetails } },
        { new: true, runValidators: true }
      ).lean();

      return updatedProvider;
    } catch (error) {
      throw new Error(
        `Failed to update witness details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get providers with pagination
   */
  static async getProvidersWithPagination(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ): Promise<PaginatedResult> {
    try {
      const skip = (page - 1) * limit;
      const query: FilterQuery<ServiceProviderData> = {};

      if (filters) {
        if (filters.region)
          query["location.region"] = new RegExp(filters.region, "i");
        if (filters.city)
          query["location.city"] = new RegExp(filters.city, "i");
        if (filters.serviceId && Types.ObjectId.isValid(filters.serviceId)) {
          query.serviceRendering = filters.serviceId;
        }
      }

      const providers = await ServiceProviderModel.find(query)
        .skip(skip)
        .limit(limit)
        .lean();

      const totalProviders = await ServiceProviderModel.countDocuments(query);
      const totalPages = Math.ceil(totalProviders / limit);

      return {
        providers,
        totalPages,
        currentPage: page,
        totalProviders,
      };
    } catch (error) {
      throw new Error(
        `Failed to get providers with pagination: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
