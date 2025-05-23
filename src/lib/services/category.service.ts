// src/lib/services/category.service.ts

import { Types } from "mongoose";
import { CategoryModel } from "@/models/category-service-models/categoryModel";
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/store/type/service-categories";
import { connect } from "../dbconfigue/dbConfigue";

export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    await connect();
    const categories = await CategoryModel.find({})
      .sort({ serviceCount: -1, name: 1 })
      .lean();
    return categories as Category[];
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const category = await CategoryModel.findById(id).lean();
    return category as Category | null;
  }

  static async getCategoryWithServices(id: string) {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const category = await CategoryModel.findById(id)
      .populate({
        path: "services",
        match: { isActive: true },
        options: { sort: { popular: -1, createdAt: -1 } },
      })
      .lean();
    return category;
  }

  static async createCategory(data: CreateCategoryInput): Promise<Category> {
    await connect();
    const category = new CategoryModel(data);
    await category.save();
    return category.toObject() as Category;
  }

  static async updateCategory(
    data: UpdateCategoryInput
  ): Promise<Category | null> {
    await connect();
    if (!Types.ObjectId.isValid(data.id)) {
      return null;
    }
    const { id, ...updateData } = data;
    const category = await CategoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return category as Category | null;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    await connect();
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    // Check if category has services
    const category = await CategoryModel.findById(id);
    if (!category) return false;

    if ((category?.serviceCount ?? 0) > 0) {
      throw new Error("Cannot delete category with existing services");
    }

    const result = await CategoryModel.findByIdAndDelete(id);
    return !!result;
  }

  static async getCategoriesWithServiceCount(): Promise<Category[]> {
    await connect();
    const categories = await CategoryModel.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "categoryId",
          as: "services",
          pipeline: [{ $match: { isActive: true } }],
        },
      },
      {
        $addFields: {
          serviceCount: { $size: "$services" },
        },
      },
      {
        $project: {
          services: 0,
          __v: 0,
        },
      },
      {
        $addFields: {
          id: { $toString: "$_id" },
        },
      },
      {
        $unset: "_id",
      },
      {
        $sort: { serviceCount: -1, name: 1 },
      },
    ]);

    return categories;
  }
}
