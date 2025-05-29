// src/models/category-service-models/categoryModel.ts
import { Category } from "@/store/type/service-categories";
import { Schema, model, models, Document, Types } from "mongoose";

// Define the document interface that matches MongoDB structure
export interface ICategoryDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  catImage?: {
    url: string;
    alt: string;
  };
  serviceIds: Types.ObjectId[];
  serviceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define a lean document type for when using .lean()
export interface ICategoryLean {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  catImage?: {
    url: string;
    alt: string;
  };
  serviceIds: Types.ObjectId[];
  serviceCount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    catImage: {
      url: {
        type: String,
        trim: true,
      },
      alt: {
        type: String,
        trim: true,
      },
    },
    serviceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    serviceCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.serviceIds =
          ret.serviceIds?.map((id: Types.ObjectId) => id.toString()) || [];
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.serviceIds =
          ret.serviceIds?.map((id: Types.ObjectId) => id.toString()) || [];
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ serviceCount: -1 });

// Virtual for populated services
categorySchema.virtual("services", {
  ref: "Service",
  localField: "_id",
  foreignField: "categoryId",
});

// Pre-save middleware to update serviceCount
categorySchema.pre("save", async function (next) {
  if (this.isModified("serviceIds")) {
    this.serviceCount = this.serviceIds.length;
  }
  next();
});

// Static method to transform lean document to Category interface
categorySchema.statics.transformLeanToCategory = function (
  doc: ICategoryLean
): Category {
  if (!doc) return doc;

  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    catImage: doc.catImage,
    serviceIds: doc.serviceIds?.map((id) => id.toString()) || [],
    serviceCount: doc.serviceCount || 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

// Add the static method to the interface
import type { Model } from "mongoose";

export interface ICategoryModel {
  transformLeanToCategory(doc: ICategoryLean): Category;
}

// Check if model exists before creating it
type CategoryModelType = Model<ICategoryDocument> & ICategoryModel;

export const CategoryModel = (models.Category ||
  model<ICategoryDocument>("Category", categorySchema)) as CategoryModelType;
