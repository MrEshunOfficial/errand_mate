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
