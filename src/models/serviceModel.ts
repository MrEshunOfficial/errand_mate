// src/models/Service.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface for additional fees
interface IAdditionalFee {
  name: string;
  amount: number;
  description?: string;
}

// Interface for service pricing
interface IServicePricing {
  basePrice: number;
  currency: string;
  percentageCharge?: number;
  additionalFees?: IAdditionalFee[];
  pricingNotes?: string;
}

// Main Service interface extending mongoose Document
export interface IService extends Document {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string; // reference to category id
  icon: string; // icon name or reference
  pricing: IServicePricing;
  locations: string[]; // array of location ids
  popular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Additional Fee Schema
const AdditionalFeeSchema = new Schema<IAdditionalFee>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Service Pricing Schema
const ServicePricingSchema = new Schema<IServicePricing>(
  {
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    percentageCharge: {
      type: Number,
      min: 0,
      max: 100,
    },
    additionalFees: [AdditionalFeeSchema],
    pricingNotes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Main Service Schema
const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      ref: "ServiceCategory", // Reference to ServiceCategory model
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    pricing: {
      type: ServicePricingSchema,
      required: true,
    },
    locations: [
      {
        type: String,
        required: true,
      },
    ],
    popular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
    collection: "services",
  }
);

// Indexes for better performance
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ locations: 1 });
ServiceSchema.index({ popular: 1, isActive: 1 });
ServiceSchema.index({ title: "text", description: "text" }); // Text search index

// Virtual for formatted pricing
ServiceSchema.virtual("formattedPrice").get(function () {
  return `${this.pricing.currency} ${this.pricing.basePrice.toFixed(2)}`;
});

// Instance method to check if service is available in location
ServiceSchema.methods.isAvailableInLocation = function (
  locationId: string
): boolean {
  return this.locations.includes(locationId);
};

// Static method to find active services by category
ServiceSchema.statics.findActiveByCategory = function (categoryId: string) {
  return this.find({ category: categoryId, isActive: true });
};

// Static method to find popular services
ServiceSchema.statics.findPopular = function (limit: number = 10) {
  return this.find({ popular: true, isActive: true }).limit(limit);
};

// Pre-save middleware to ensure locations array is not empty
ServiceSchema.pre("save", function (next) {
  if (this.locations.length === 0) {
    next(new Error("Service must be available in at least one location"));
  } else {
    next();
  }
});

// Export the model with existence check
export const Service =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

// Helper functions for service operations
export class ServiceModel {
  // Create a new service
  static async createService(
    serviceData: Partial<IService>
  ): Promise<IService> {
    const service = new Service(serviceData);
    return await service.save();
  }

  // Find services by category with pagination
  static async findByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ services: IService[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const services = await Service.find({
      category: categoryId,
      isActive: true,
    })
      .skip(skip)
      .limit(limit)
      .populate("category")
      .sort({ popular: -1, createdAt: -1 });

    const total = await Service.countDocuments({
      category: categoryId,
      isActive: true,
    });

    return {
      services,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  // Find services by location
  static async findByLocation(locationId: string): Promise<IService[]> {
    return await Service.find({
      locations: locationId,
      isActive: true,
    }).populate("category");
  }

  // Search services by text
  static async searchServices(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ services: IService[]; total: number }> {
    const skip = (page - 1) * limit;
    const services = await Service.find(
      {
        $text: { $search: query },
        isActive: true,
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .populate("category");

    const total = await Service.countDocuments({
      $text: { $search: query },
      isActive: true,
    });

    return { services, total };
  }

  // Update service pricing
  static async updatePricing(
    serviceId: string,
    pricing: IServicePricing
  ): Promise<IService | null> {
    return await Service.findByIdAndUpdate(
      serviceId,
      { pricing },
      { new: true, runValidators: true }
    );
  }

  // Toggle service popularity
  static async togglePopular(serviceId: string): Promise<IService | null> {
    const service = await Service.findById(serviceId);
    if (service) {
      service.popular = !service.popular;
      return await service.save();
    }
    return null;
  }

  // Deactivate service
  static async deactivateService(serviceId: string): Promise<IService | null> {
    return await Service.findByIdAndUpdate(
      serviceId,
      { isActive: false },
      { new: true }
    );
  }
}
