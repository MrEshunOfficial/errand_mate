// src/models/category.model.ts
import { Category } from "@/store/type/service-categories";
import { Schema, model, Document, Types } from "mongoose";

export interface ICategoryDocument extends Omit<Category, "id">, Document {
  _id: Types.ObjectId;
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
    icon: {
      type: String,
      trim: true,
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
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
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

export const CategoryModel = model<ICategoryDocument>(
  "Category",
  categorySchema
);
