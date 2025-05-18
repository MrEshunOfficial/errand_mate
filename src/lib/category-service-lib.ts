import mongoose from 'mongoose';
import { Category as CategoryInterface } from '@/store/type/serviceCategories';
import Category from '@/models/categoryModel';

// Establish DB connection
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connections[0].readyState) {
    // If already connected, return the existing connection
    return mongoose;
  }
  
  // Connect to MongoDB
  return mongoose.connect(process.env.MONGODB_URI as string);
};

// Format Category document to match interface
import { Document } from 'mongoose';

export const formatCategoryDoc = (doc: Document | CategoryInterface): CategoryInterface => {
  const category = (doc as Document).toObject ? (doc as Document).toObject() : doc;
  
  return {
    id: category.id,
    name: category.name,
    description: category.description || '',
    icon: category.icon || '',
    subcategories: category.subcategories || [],
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
};


// Get all categories
export const getAllCategories = async (): Promise<CategoryInterface[]> => {
  await connectToDatabase();
  const categories = await Category.find({}).sort({ createdAt: -1 });
  return categories.map(formatCategoryDoc);
};

// Get a single category by ID
export const getCategoryById = async (id: string): Promise<CategoryInterface | null> => {
  await connectToDatabase();
  const category = await Category.findOne({ id });
  return category ? formatCategoryDoc(category) : null;
};

// Create a new category
export const createCategory = async (data: Partial<CategoryInterface>): Promise<CategoryInterface> => {
  await connectToDatabase();
  
  // Generate a new ID if not provided
  if (!data.id) {
    data.id = new mongoose.Types.ObjectId().toString();
  }
  
  const newCategory = await Category.create(data);
  return formatCategoryDoc(newCategory);
};

// Update a category
export const updateCategory = async (
  id: string, 
  data: Partial<CategoryInterface>
): Promise<CategoryInterface | null> => {
  await connectToDatabase();
  
  const updatedCategory = await Category.findOneAndUpdate(
    { id },
    { $set: data },
    { new: true }
  );
  
  return updatedCategory ? formatCategoryDoc(updatedCategory) : null;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  await connectToDatabase();
  const result = await Category.deleteOne({ id });
  return result.deletedCount === 1;
};

// Add a subcategory to a category
export const addSubcategory = async (
  categoryId: string, 
  subcategoryData: { name: string, id?: string }
): Promise<CategoryInterface | null> => {
  await connectToDatabase();
  
  // Generate a new ID if not provided
  if (!subcategoryData.id) {
    subcategoryData.id = new mongoose.Types.ObjectId().toString();
  }
  
  const updatedCategory = await Category.findOneAndUpdate(
    { id: categoryId },
    { $push: { subcategories: subcategoryData } },
    { new: true }
  );
  
  return updatedCategory ? formatCategoryDoc(updatedCategory) : null;
};

// Update a subcategory
export const updateSubcategory = async (
  categoryId: string,
  subcategoryId: string,
  subcategoryData: { name: string }
): Promise<CategoryInterface | null> => {
  await connectToDatabase();
  
  const updatedCategory = await Category.findOneAndUpdate(
    { id: categoryId, 'subcategories.id': subcategoryId },
    { $set: { 'subcategories.$.name': subcategoryData.name } },
    { new: true }
  );
  
  return updatedCategory ? formatCategoryDoc(updatedCategory) : null;
};

// Delete a subcategory
export const deleteSubcategory = async (
  categoryId: string,
  subcategoryId: string
): Promise<CategoryInterface | null> => {
  await connectToDatabase();
  
  const updatedCategory = await Category.findOneAndUpdate(
    { id: categoryId },
    { $pull: { subcategories: { id: subcategoryId } } },
    { new: true }
  );
  
  return updatedCategory ? formatCategoryDoc(updatedCategory) : null;
};

// Remove Excel file from a category
export const removeExcelFile = async (categoryId: string): Promise<CategoryInterface | null> => {
  await connectToDatabase();
  
  const updatedCategory = await Category.findOneAndUpdate(
    { id: categoryId },
    { $set: { excel_file: null } },
    { new: true }
  );
  
  return updatedCategory ? formatCategoryDoc(updatedCategory) : null;
};