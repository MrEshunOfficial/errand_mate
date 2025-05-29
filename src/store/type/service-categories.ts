// src/types/base.ts
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/category.ts
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  icon?: string;
  serviceIds: string[];
  serviceCount?: number;
}

export interface Service extends BaseEntity {
  title: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  icon?: string;
  popular: boolean;
  isActive: boolean;
  tags?: string[];
}

// src/types/composed.ts - For when you need populated data
export interface CategoryWithServices extends Omit<Category, "serviceIds"> {
  services: Service[];
}

export interface ServiceWithCategory extends Service {
  category: Pick<Category, "id" | "name" | "icon">;
}

// src/types/operations.ts - For CRUD operations
export interface CreateServiceInput {
  title: string;
  description: string;
  categoryId: string;
  icon?: string;
  popular?: boolean;
  isActive?: boolean;
  tags?: string[];
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

// src/types/api.ts - For API responses
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ServiceFilters {
  categoryId?: string;
  isActive?: boolean;
  popular?: boolean;
  search?: string;
}

// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface CustomResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
}
