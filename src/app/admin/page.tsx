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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Lucide React icons
import {
  PlusCircle,
  FolderPlus,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  Folder,
  List,
  Search,
  ChevronRight,
  Layers,
  Tag,
  FileText,
} from "lucide-react";

const CategoryManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, currentCategory, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  // Local state
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editSubcategoryId, setEditSubcategoryId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSubcategoryDialogOpen, setDeleteSubcategoryDialogOpen] =
    useState(false);
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState<string | null>(
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

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    dispatch(fetchCategoryById(categoryId));
    setCategoryName("");
    setSubcategoryName("");
    setEditMode(false);
    setEditSubcategoryId(null);
    setShowNewCategoryForm(false);
  };

  // Handle new category creation
  const handleCreateCategory = () => {
    if (categoryName.trim()) {
      dispatch(createNewCategory({ name: categoryName }));
      setCategoryName("");
      setShowNewCategoryForm(false);
    }
  };

  // Handle category update
  const handleUpdateCategory = () => {
    if (currentCategory && categoryName.trim()) {
      dispatch(
        updateExistingCategory({
          id: currentCategory.id,
          data: { name: categoryName },
        })
      );
      setCategoryName("");
      setEditMode(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = () => {
    if (currentCategory) {
      dispatch(deleteExistingCategory(currentCategory.id));
      setDeleteDialogOpen(false);
    }
  };

  // Handle subcategory addition
  const handleAddSubcategory = () => {
    if (currentCategory && subcategoryName.trim()) {
      dispatch(
        addNewSubcategory({
          id: currentCategory.id,
          subcategoryData: { name: subcategoryName },
        })
      );
      setSubcategoryName("");
    }
  };

  // Handle subcategory update
  const handleUpdateSubcategory = () => {
    if (currentCategory && editSubcategoryId && subcategoryName.trim()) {
      dispatch(
        updateExistingSubcategory({
          id: currentCategory.id,
          subcategoryId: editSubcategoryId,
          subcategoryData: { name: subcategoryName },
        })
      );
      setSubcategoryName("");
      setEditSubcategoryId(null);
    }
  };

  // Handle subcategory deletion
  const handleDeleteSubcategory = () => {
    if (currentCategory && deleteSubcategoryId) {
      dispatch(
        deleteExistingSubcategory({
          id: currentCategory.id,
          serviceId: deleteSubcategoryId,
        })
      );
      setDeleteSubcategoryDialogOpen(false);
      setDeleteSubcategoryId(null);
    }
  };

  // Handle edit subcategory mode
  const handleEditSubcategory = (subcategoryId: string, name: string) => {
    setSubcategoryName(name);
    setEditSubcategoryId(subcategoryId);
  };

  // Handle cancel actions
  const handleCancel = () => {
    setCategoryName("");
    setEditMode(false);
  };

  const handleSubcategoryCancel = () => {
    setSubcategoryName("");
    setEditSubcategoryId(null);
  };

  // Handle new category form
  const handleNewCategory = () => {
    dispatch(clearCurrentCategory());
    setCategoryName("");
    setSubcategoryName("");
    setEditMode(false);
    setEditSubcategoryId(null);
    setShowNewCategoryForm(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="container mx-auto p-6">
          {/* Header with New Category Button moved to nav bar */}
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
                  onClick={handleNewCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-300/20 dark:shadow-blue-900/30 transition-all duration-200"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> New Category
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                            onClick={() => handleCategorySelect(category.id)}
                          >
                            <div className="flex items-center">
                              <Tag
                                className={`h-4 w-4 mr-2 ${
                                  currentCategory?.id === category.id
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                              />
                              <span className="font-medium">
                                {category.name}
                              </span>
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

            {/* Main Content Area */}
            <Card className="lg:col-span-9 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-blue-100 dark:shadow-slate-900/50 overflow-hidden">
              {showNewCategoryForm ? (
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                      <FolderPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        Create New Category
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400">
                        Add a new category to organize your services
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="category-name"
                          className="text-slate-700 dark:text-slate-300 block mb-2"
                        >
                          Category Name
                        </Label>
                        <Input
                          id="category-name"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          placeholder="Enter category name"
                          className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div className="pt-4 flex space-x-3">
                        <Button
                          onClick={handleCreateCategory}
                          disabled={!categoryName.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
                        >
                          <Save className="mr-2 h-4 w-4" /> Create Category
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewCategoryForm(false)}
                          className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !currentCategory ? (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-240px)] p-8">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-6">
                    <Folder className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Select a Category
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                    Choose a category from the sidebar or create a new one to
                    get started.
                  </p>
                  <Button
                    onClick={handleNewCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-300/20 dark:shadow-blue-900/30 transition-all duration-200"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Category
                  </Button>
                </div>
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
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700 mb-6">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                        <Folder className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Category Details
                      </h3>

                      {editMode ? (
                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="edit-category-name"
                              className="text-slate-700 dark:text-slate-300 block mb-2"
                            >
                              Category Name
                            </Label>
                            <Input
                              id="edit-category-name"
                              value={categoryName}
                              onChange={(e) => setCategoryName(e.target.value)}
                              placeholder="Enter category name"
                              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                            />
                          </div>
                          <div className="pt-4 flex space-x-3">
                            <Button
                              onClick={handleUpdateCategory}
                              disabled={!categoryName.trim()}
                              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
                            >
                              <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancel}
                              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block mb-1">
                                Category ID
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 font-mono text-sm">
                                {currentCategory.id}
                              </span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block mb-1">
                                Services Count
                              </span>
                              <div className="flex items-center">
                                <span className="text-slate-800 dark:text-slate-200 text-xl font-bold mr-2">
                                  {currentCategory.subcategories.length}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {currentCategory.subcategories.length === 1
                                    ? "service"
                                    : "services"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Button
                              onClick={() => {
                                setEditMode(true);
                                setCategoryName(currentCategory.name);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit Category
                            </Button>
                            <Dialog
                              open={deleteDialogOpen}
                              onOpenChange={setDeleteDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  Category
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                <DialogHeader>
                                  <DialogTitle className="text-slate-800 dark:text-slate-200">
                                    Delete Category
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                                    Are you sure you want to delete the category
                                    &quot;{currentCategory.name}
                                    &quot;? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteDialogOpen(false)}
                                    className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={handleDeleteCategory}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Services Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700 mb-6">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                        <List className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Services
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div>
                          <Label
                            htmlFor="subcategory-name"
                            className="text-slate-700 dark:text-slate-300 block mb-2"
                          >
                            {editSubcategoryId
                              ? "Edit Service Name"
                              : "Add New Service"}
                          </Label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                              id="subcategory-name"
                              value={subcategoryName}
                              onChange={(e) =>
                                setSubcategoryName(e.target.value)
                              }
                              placeholder="Enter service name"
                              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                            />
                            {editSubcategoryId ? (
                              <div className="flex gap-2">
                                <Button
                                  onClick={handleUpdateSubcategory}
                                  disabled={!subcategoryName.trim()}
                                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
                                >
                                  <Save className="mr-2 h-4 w-4" /> Update
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={handleSubcategoryCancel}
                                  className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  <X className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={handleAddSubcategory}
                                disabled={!subcategoryName.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
                              >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add
                                Service
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-700 dark:text-slate-300">
                            Services List
                          </h4>
                          <Badge
                            variant="outline"
                            className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            {currentCategory.subcategories.length}
                          </Badge>
                        </div>

                        {currentCategory.subcategories.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {currentCategory.subcategories.map(
                              (subcategory) => (
                                <div
                                  key={subcategory.id}
                                  className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
                                >
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md mr-3">
                                      <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                      {subcategory.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleEditSubcategory(
                                          subcategory.id,
                                          subcategory.name
                                        )
                                      }
                                      className="h-8 px-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Dialog
                                      open={
                                        deleteSubcategoryDialogOpen &&
                                        deleteSubcategoryId === subcategory.id
                                      }
                                      onOpenChange={(open) => {
                                        setDeleteSubcategoryDialogOpen(open);
                                        if (open) {
                                          setDeleteSubcategoryId(
                                            subcategory.id
                                          );
                                        } else {
                                          setDeleteSubcategoryId(null);
                                        }
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 px-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <DialogHeader>
                                          <DialogTitle className="text-slate-800 dark:text-slate-200">
                                            Delete Service
                                          </DialogTitle>
                                          <DialogDescription className="text-slate-600 dark:text-slate-400">
                                            Are you sure you want to delete the
                                            service &quot;{subcategory.name}
                                            &quot;? This action cannot be
                                            undone.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              setDeleteSubcategoryDialogOpen(
                                                false
                                              )
                                            }
                                            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            onClick={handleDeleteSubcategory}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                                            Delete
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center bg-slate-50 dark:bg-slate-900/50 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full inline-flex mx-auto mb-4">
                              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                              No Services Yet
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                              Add your first service to this category
                            </p>
                            <Button
                              onClick={() => setSubcategoryName("")}
                              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30"
                            >
                              <PlusCircle className="mr-2 h-4 w-4" /> Add First
                              Service
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tips Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-md border border-blue-100 dark:border-blue-900/30">
                      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-3">
                        Tips & Best Practices
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full mr-2 mt-1">
                            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </span>
                          <span className="text-sm text-blue-800 dark:text-blue-200">
                            Create logical categories to organize your services
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full mr-2 mt-1">
                            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </span>
                          <span className="text-sm text-blue-800 dark:text-blue-200">
                            Use descriptive names for better search results
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-blue-100 dark:bg-blue-800/50 p-1 rounded-full mr-2 mt-1">
                            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </span>
                          <span className="text-sm text-blue-800 dark:text-blue-200">
                            Regularly review and update your categories
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryManager;
