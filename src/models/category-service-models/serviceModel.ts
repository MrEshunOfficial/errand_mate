// src/models/service.model.ts
import { Service, ServicePricing } from "@/store/type/service-categories";
import { Schema, model, Document, Types } from "mongoose";
// import { Service, ServicePricing } from "../types/service";

export interface IServiceDocument
  extends Omit<Service, "id" | "categoryId">,
    Document {
  _id: Types.ObjectId;
  categoryId: string | Types.ObjectId;
}

const servicePricingSchema = new Schema<ServicePricing>(
  {
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["USD", "EUR", "GBP", "CAD", "AUD"], // Add more currencies as needed
      default: "USD",
    },
    percentageCharge: {
      type: Number,
      min: 0,
      max: 100,
    },
    additionalFees: [
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
    ],
    pricingNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const serviceSchema = new Schema<IServiceDocument>(
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
      trim: true,
      maxlength: 2000,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    pricing: {
      type: servicePricingSchema,
      required: true,
    },
    locations: [
      {
        type: String,
        required: true,
        trim: true,
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
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.categoryId = ret.categoryId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.categoryId = ret.categoryId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
serviceSchema.index({ categoryId: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ popular: -1 });
serviceSchema.index({ locations: 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ title: "text", description: "text", tags: "text" });
serviceSchema.index({ "pricing.basePrice": 1 });
serviceSchema.index({ createdAt: -1 });

// Compound indexes for common queries
serviceSchema.index({ categoryId: 1, isActive: 1, popular: -1 });
serviceSchema.index({ locations: 1, isActive: 1 });

// Virtual for populated category
serviceSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

// Post-save middleware to update category serviceIds and serviceCount
serviceSchema.post("save", async function (doc) {
  try {
    const CategoryModel = model("Category");
    await CategoryModel.findByIdAndUpdate(doc.categoryId, {
      $addToSet: { serviceIds: doc._id },
      $inc: { serviceCount: 1 },
    });
  } catch (error) {
    console.error("Error updating category after service save:", error);
  }
});

// Post-remove middleware to update category serviceIds and serviceCount
serviceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      const CategoryModel = model("Category");
      await CategoryModel.findByIdAndUpdate(doc.categoryId, {
        $pull: { serviceIds: doc._id },
        $inc: { serviceCount: -1 },
      });
    } catch (error) {
      console.error("Error updating category after service deletion:", error);
    }
  }
});

export const ServiceModel = model<IServiceDocument>("Service", serviceSchema);
