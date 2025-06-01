// src/models/service.model.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface IServiceDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  categoryId: Types.ObjectId;
  serviceImage?: {
    url: string;
    serviceName: string;
  };
  popular: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    serviceImage: {
      url: {
        type: String,
        trim: true,
      },
      serviceName: {
        type: String,
        trim: true,
      },
    },
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
        ret._id = ret._id.toString();
        ret.categoryId = ret.categoryId.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret._id = ret._id.toString();
        ret.categoryId = ret.categoryId.toString();
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
serviceSchema.index({ tags: 1 });
serviceSchema.index({ title: "text", description: "text", tags: "text" });
serviceSchema.index({ createdAt: -1 });

// Compound indexes for common queries
serviceSchema.index({ categoryId: 1, isActive: 1, popular: -1 });

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
    // Import here to avoid circular dependencies
    const { CategoryModel } = await import(
      "@/models/category-service-models/categoryModel"
    );
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
      // Import here to avoid circular dependencies
      const { CategoryModel } = await import(
        "@/models/category-service-models/categoryModel"
      );
      await CategoryModel.findByIdAndUpdate(doc.categoryId, {
        $pull: { serviceIds: doc._id },
        $inc: { serviceCount: -1 },
      });
    } catch (error) {
      console.error("Error updating category after service deletion:", error);
    }
  }
});

// Create and export the model
export const ServiceModel =
  models.Service || model<IServiceDocument>("Service", serviceSchema);

// Default export for easier importing
export default ServiceModel;
