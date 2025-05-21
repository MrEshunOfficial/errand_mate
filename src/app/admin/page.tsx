"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCategories,
  fetchCategoryById,
  createNewCategory,
  updateExistingCategory,
  deleteExistingCategory,
  addNewSubcategory,
  updateExistingSubcategory,
  deleteExistingSubcategory,
  clearCurrentCategory,
} from "@/store/category-redux-slice";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Lucide React icons
import {
  PlusCircle,
  RefreshCw,
  AlertTriangle,
  Folder,
  Search,
  ChevronRight,
  Layers,
  Tag,
  FileText,
} from "lucide-react";

import { CategoryFormSection } from "./CategoryForms";
import ServicesSection from "./ServicesSection";
import TipsSection from "./TipsSection";
import CategoryDetails from "./CategoryDetails";

// Types
interface Subcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  subcategories: Subcategory[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Sidebar Props
interface CategorySidebarProps {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onNewCategory: () => void;
}

// Category Sidebar Component
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  currentCategory,
  loading,
  searchTerm,
  onSearchChange,
  onCategorySelect,
  onNewCategory,
}) => {
  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="lg:col-span-3 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100 dark:shadow-slate-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-slate-800 dark:text-slate-200">
            <Folder className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Categories
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          >
            {categories.length}
          </Badge>
        </div>

        <Button
          onClick={onNewCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-300/20 dark:shadow-blue-900/30 transition-all duration-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Category
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <RefreshCw className="h-5 w-5 animate-spin mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-slate-600 dark:text-slate-400">
              Loading categories...
            </span>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="pt-1 px-1">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`mb-1 p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-all duration-200 ${
                      currentCategory?.id === category.id
                        ? "bg-blue-100/80 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-l-4 border-blue-500 dark:border-blue-400"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => onCategorySelect(category.id)}
                  >
                    <div className="flex items-center">
                      <Tag
                        className={`h-4 w-4 mr-2 ${
                          currentCategory?.id === category.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={`${
                          currentCategory?.id === category.id
                            ? "bg-blue-200/50 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {category.subcategories.length}
                      </Badge>
                      <ChevronRight
                        className={`h-4 w-4 ml-1 ${
                          currentCategory?.id === category.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-slate-500 dark:text-slate-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-lg font-medium mb-1">
                    No categories found
                  </p>
                  <p className="text-sm">
                    {searchTerm
                      ? "Try a different search term"
                      : "Create a new category to get started"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState: React.FC<{ onNewCategory: () => void }> = ({
  onNewCategory,
}) => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)] p-8">
    <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-6">
      <Folder className="h-16 w-16 text-blue-600 dark:text-blue-400" />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
      Select a Category
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
      Choose a category from the sidebar or create a new one to get started.
    </p>
    <Button
      onClick={onNewCategory}
      className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-300/20 dark:shadow-blue-900/30 transition-all duration-200"
    >
      <PlusCircle className="mr-2 h-4 w-4" /> Create New Category
    </Button>
  </div>
);

// Main CategoryManager Component
const CategoryManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, currentCategory, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  // Local state
  const [subcategoryName, setSubcategoryName] = useState("");
  const [editSubcategoryId, setEditSubcategoryId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);

  // Fetch all categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && !currentCategory && !showNewCategoryForm) {
      dispatch(fetchCategoryById(categories[0].id));
    }
  }, [categories, currentCategory, dispatch, showNewCategoryForm]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    dispatch(fetchCategoryById(categoryId));
    setSubcategoryName("");
    setEditSubcategoryId(null);
    setShowNewCategoryForm(false);
  };

  // Handle new category form
  const handleNewCategory = () => {
    dispatch(clearCurrentCategory());
    setSubcategoryName("");
    setEditSubcategoryId(null);
    setShowNewCategoryForm(true);
  };

  // Category CRUD operations
  const handleCreateCategory = (data: {
    name: string;
    description?: string;
    icon?: string;
  }) => {
    dispatch(createNewCategory(data));
    setShowNewCategoryForm(false);
  };

  const handleUpdateCategory = (data: Partial<Category>) => {
    if (currentCategory) {
      dispatch(
        updateExistingCategory({
          id: currentCategory.id,
          data: data,
        })
      );
    }
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      dispatch(deleteExistingCategory(currentCategory.id));
    }
  };

  // Subcategory CRUD operations
  const handleAddSubcategory = (data: {
    name: string;
    description?: string;
  }) => {
    if (currentCategory) {
      dispatch(
        addNewSubcategory({
          id: currentCategory.id,
          subcategoryData: data,
        })
      );
      setSubcategoryName("");
    }
  };

  const handleUpdateSubcategory = (data: {
    name: string;
    description?: string;
  }) => {
    if (currentCategory && editSubcategoryId) {
      dispatch(
        updateExistingSubcategory({
          id: currentCategory.id,
          subcategoryId: editSubcategoryId,
          subcategoryData: data,
        })
      );
      setSubcategoryName("");
      setEditSubcategoryId(null);
    }
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    if (currentCategory) {
      dispatch(
        deleteExistingSubcategory({
          id: currentCategory.id,
          serviceId: subcategoryId,
        })
      );
    }
  };

  const handleEditSubcategory = (subcategoryId: string, name: string) => {
    setSubcategoryName(name);
    setEditSubcategoryId(subcategoryId);
  };

  const handleSubcategoryCancel = () => {
    setSubcategoryName("");
    setEditSubcategoryId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className="bg-blue-600 dark:bg-blue-500 rounded-xl p-2 mr-3">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300">
                Category Manager
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Organize your categories and services efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 shadow-md"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <CategorySidebar
            categories={categories}
            currentCategory={currentCategory}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCategorySelect={handleCategorySelect}
            onNewCategory={handleNewCategory}
          />

          {/* Main Content Area */}
          <Card className="lg:col-span-9 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100 dark:shadow-slate-900/50 overflow-hidden">
            {showNewCategoryForm ? (
              <CategoryFormSection
                showCategoryForm={true}
                categoryFormMode="create"
                onCategorySubmit={handleCreateCategory}
                onCategoryCancel={() => setShowNewCategoryForm(false)}
                categoryLoading={loading}
                showSubcategoryForm={false}
                subcategoryFormMode="create"
                onSubcategorySubmit={handleAddSubcategory}
                onSubcategoryCancel={handleSubcategoryCancel}
                subcategoryLoading={loading}
              />
            ) : !currentCategory ? (
              <EmptyState onNewCategory={handleNewCategory} />
            ) : (
              <div>
                {/* Combined Details and Services View */}
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">
                      {currentCategory.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Category Details Section */}
                  <CategoryDetails
                    category={currentCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    loading={loading}
                  />

                  {/* Services Section */}
                  <ServicesSection
                    currentCategory={currentCategory}
                    subcategoryName={subcategoryName}
                    editSubcategoryId={editSubcategoryId}
                    onSubcategoryNameChange={setSubcategoryName}
                    onAddSubcategory={handleAddSubcategory}
                    onUpdateSubcategory={handleUpdateSubcategory}
                    onDeleteSubcategory={handleDeleteSubcategory}
                    onEditSubcategory={handleEditSubcategory}
                    onCancelEdit={handleSubcategoryCancel}
                    loading={loading}
                  />

                  {/* Tips Section */}
                  <TipsSection />
                </CardContent>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;