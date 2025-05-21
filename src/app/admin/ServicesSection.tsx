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
  ExternalLinkIcon,
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
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-100 dark:border-slate-700 mb-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <List className="inline mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
        Services
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <Label
            htmlFor="subcategory-name"
            className="text-slate-700 dark:text-slate-300 block mb-2">
            {editSubcategoryId ? "Edit Service Name" : "Add New Service"}
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              id="subcategory-name"
              value={subcategoryName}
              onChange={(e) => onSubcategoryNameChange(e.target.value)}
              placeholder="Enter service name"
              className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
              disabled={loading}
            />
            {editSubcategoryId ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateSubcategory}
                  disabled={!subcategoryName.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Updating..." : "Update"}
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancelEdit}
                  disabled={loading}
                  className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddSubcategory}
                disabled={!subcategoryName.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30">
                <PlusCircle className="mr-2 h-4 w-4" />
                {loading ? "Adding..." : "Add Service"}
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
            className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            {currentCategory.subcategories.length}
          </Badge>
        </div>

        {currentCategory.subcategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {currentCategory.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
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
                      onEditSubcategory(subcategory.id, subcategory.name)
                    }
                    disabled={loading}
                    className="h-8 px-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDeleteDialog(subcategory.id)}
                    disabled={loading}
                    className="h-8 px-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link
                    href={`/admin/${subcategory.id}`}
                    className="h-8 px-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
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
              onClick={() => onSubcategoryNameChange("")}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md shadow-blue-300/20 dark:shadow-blue-900/30">
              <PlusCircle className="mr-2 h-4 w-4" /> Add First Service
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteSubcategoryDialogOpen}
        onOpenChange={setDeleteSubcategoryDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-slate-200">
              Delete Service
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete the service &quot;
              {
                currentCategory.subcategories.find(
                  (sub) => sub.id === deleteSubcategoryId
                )?.name
              }
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={loading}
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubcategory}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="mr-2 h-4 w-4" />
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesSection;
