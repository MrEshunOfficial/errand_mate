// src/models/category-service-models/categoryModel.ts
import { Category } from "@/store/type/service-categories";
import { Schema, model, models, Document, Types } from "mongoose";

// Define the document interface that matches MongoDB structure
export interface ICategoryDocument extends Document {
  _id: Types.ObjectId;
  categoryName: string;
  description?: string;
  catImage?: {
    url: string;
    catName: string;
  };
  tags?: string[];
  serviceIds: Types.ObjectId[];
  serviceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define a lean document type for when using .lean()
export interface ICategoryLean {
  _id: Types.ObjectId;
  categoryName: string;
  description?: string;
  catImage?: {
    url: string;
    catName: string;
  };
  tags?: string[];
  serviceIds: Types.ObjectId[];
  serviceCount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    categoryName: {
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
      catName: {
        type: String,
        trim: true,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
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
        ret._id = ret._id.toString();
        ret.serviceIds =
          ret.serviceIds?.map((id: Types.ObjectId) => id.toString()) || [];
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret._id = ret._id.toString();
        ret.serviceIds =
          ret.serviceIds?.map((id: Types.ObjectId) => id.toString()) || [];
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
categorySchema.index({ categoryName: 1 }, { unique: true });
categorySchema.index({ serviceCount: -1 });
categorySchema.index({ tags: 1 });
categorySchema.index({ createdAt: -1 });

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
    _id: doc._id, // Fixed: was doc.id instead of doc._id
    categoryName: doc.categoryName,
    description: doc.description,
    catImage: doc.catImage,
    tags: doc.tags,
    serviceIds: doc.serviceIds?.map((id) => id.toString()) || [],
    serviceCount: doc.serviceCount || 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

// Add the static method to the interface
import type { Model } from "mongoose";
export interface ICategoryModel extends Model<ICategoryDocument> {
  transformLeanToCategory(doc: ICategoryLean): Category;
}

// Check if we're on the server side before creating the model
let CategoryModel: ICategoryModel;

if (typeof window === 'undefined') {
  // Server-side: safe to use mongoose models
  CategoryModel = (models?.Category as ICategoryModel) || 
    model<ICategoryDocument, ICategoryModel>("Category", categorySchema);
} else {
  // Client-side: create a mock model to prevent errors
  CategoryModel = {
    transformLeanToCategory: (doc: ICategoryLean): Category => {
      if (!doc) return doc;
      return {
        _id: doc._id,
        categoryName: doc.categoryName,
        description: doc.description,
        catImage: doc.catImage,
        tags: doc.tags,
        serviceIds: doc.serviceIds?.map((id) => id.toString()) || [],
        serviceCount: doc.serviceCount || 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    }
  } as ICategoryModel;
}

export { CategoryModel };