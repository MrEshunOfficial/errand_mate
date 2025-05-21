import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Edit,
  Trash2,
  Save,
  X,
  List,
  Tag,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Subcategory {
  id: string;
  name: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface ServicesSectionProps {
  currentCategory: Category;
  subcategoryName: string;
  editSubcategoryId: string | null;
  onSubcategoryNameChange: (name: string) => void;
  onAddSubcategory: (data: { name: string; description?: string }) => void;
  onUpdateSubcategory: (data: { name: string; description?: string }) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
  onEditSubcategory: (subcategoryId: string, name: string) => void;
  onCancelEdit: () => void;
  loading: boolean;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  currentCategory,
  subcategoryName,
  editSubcategoryId,
  onSubcategoryNameChange,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
  onEditSubcategory,
  onCancelEdit,
  loading,
}) => {
  const [deleteSubcategoryDialogOpen, setDeleteSubcategoryDialogOpen] =
    useState(false);
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState<string | null>(
    null
  );

  const handleAddSubcategory = () => {
    if (subcategoryName.trim()) {
      onAddSubcategory({ name: subcategoryName.trim() });
    }
  };

  const handleUpdateSubcategory = () => {
    if (subcategoryName.trim()) {
      onUpdateSubcategory({ name: subcategoryName.trim() });
    }
  };

  const handleDeleteSubcategory = () => {
    if (deleteSubcategoryId) {
      onDeleteSubcategory(deleteSubcategoryId);
      setDeleteSubcategoryDialogOpen(false);
      setDeleteSubcategoryId(null);
    }
  };

  const openDeleteDialog = (subcategoryId: string) => {
    setDeleteSubcategoryId(subcategoryId);
    setDeleteSubcategoryDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteSubcategoryDialogOpen(false);
    setDeleteSubcategoryId(null);
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 mb-8 backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <List className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Services Management
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage services for {currentCategory.name}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-4 py-2 text-sm font-semibold"
        >
          {currentCategory.subcategories.length} Services
        </Badge>
      </div>

      {/* Add/Edit Service Form */}
      <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 mb-8 border border-slate-200/30 dark:border-slate-700/30 backdrop-blur-sm">
        <Label
          htmlFor="subcategory-name"
          className="text-slate-700 dark:text-slate-300 block mb-3 font-medium text-lg"
        >
          {editSubcategoryId ? (
            <span className="flex items-center">
              <Edit className="mr-2 h-5 w-5 text-amber-500" />
              Edit Service Name
            </span>
          ) : (
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5 text-green-500" />
              Add New Service
            </span>
          )}
        </Label>
        <div className="flex flex-col lg:flex-row gap-4">
          <Input
            id="subcategory-name"
            value={subcategoryName}
            onChange={(e) => onSubcategoryNameChange(e.target.value)}
            placeholder="Enter service name (e.g., Web Development, Mobile Apps)"
            className="flex-1 h-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 rounded-lg text-lg transition-all duration-200"
            disabled={loading}
          />
          {editSubcategoryId ? (
            <div className="flex gap-3">
              <Button
                onClick={handleUpdateSubcategory}
                disabled={!subcategoryName.trim() || loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? "Updating..." : "Update Service"}
              </Button>
              <Button
                variant="outline"
                onClick={onCancelEdit}
                disabled={loading}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 h-12 px-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <X className="mr-2 h-5 w-5" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddSubcategory}
              disabled={!subcategoryName.trim() || loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-12 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {loading ? "Adding..." : "Add Service"}
            </Button>
          )}
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
            <Tag className="mr-2 h-5 w-5 text-blue-500" />
            Available Services
          </h4>
        </div>

        {currentCategory.subcategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentCategory.subcategories.map((subcategory, index) => (
              <div
                key={subcategory.id}
                className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-lg">
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {subcategory.name}
                      </h5>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Service #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onEditSubcategory(subcategory.id, subcategory.name)
                      }
                      disabled={loading}
                      className="h-9 px-3 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteDialog(subcategory.id)}
                      disabled={loading}
                      className="h-9 px-3 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link
                    href={`/admin/${subcategory.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    <span>Manage</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl p-12 border-2 border-dashed border-slate-300 dark:border-slate-600">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-2xl inline-flex mx-auto mb-6">
              <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
              No Services Yet
            </h4>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg max-w-md mx-auto">
              Get started by adding your first service to this category.
              Services help organize your offerings.
            </p>
            <Button
              onClick={() => onSubcategoryNameChange("")}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Your First Service
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteSubcategoryDialogOpen}
        onOpenChange={setDeleteSubcategoryDialogOpen}
      >
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl p-8 max-w-md">
          <DialogHeader className="space-y-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl inline-flex mx-auto">
              <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-slate-800 dark:text-slate-200 text-xl font-bold text-center">
              Delete Service
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
              Are you sure you want to delete the service{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                &quot;
                {
                  currentCategory.subcategories.find(
                    (sub) => sub.id === deleteSubcategoryId
                  )?.name
                }
                &quot;
              </span>
              ? This action cannot be undone and will permanently remove all
              associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={loading}
              className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 h-12 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubcategory}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 rounded-lg shadow-lg transition-all duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {loading ? "Deleting..." : "Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesSection;
