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
};

// Add the static method to the interface
import type { Model } from "mongoose";

export interface ICategoryModel {
  transformLeanToCategory(doc: ICategoryLean): Category;
}

// Model type definition
type CategoryModelType = Model<ICategoryDocument> & ICategoryModel;

// Create and export the model with proper error handling and null checks
const createCategoryModel = (): CategoryModelType => {
  try {
    // Use optional chaining to safely check if models exists and has Category
    return (models?.Category || 
            model<ICategoryDocument>("Category", categorySchema)) as CategoryModelType;
  } catch (error) {
    console.error("Error creating CategoryModel:", error);
    throw new Error(`Failed to create CategoryModel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const CategoryModel = createCategoryModel();