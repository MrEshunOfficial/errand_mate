// src/types/service.ts
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
    priceType: "fixed" | "hourly" | "starting-from";
    packages?: Array<{
      name: string;
      price: number;
      description: string;
      features: string[];
    }>;
  };
  provider: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
    experience: string;
    location: string;
  };
  images: string[];
  tags: string[];
  locations: string[];
  deliveryTime: {
    min: number;
    max: number;
    unit: "hours" | "days" | "weeks";
  };
  features: string[];
  requirements?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  isActive: boolean;
  popular: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

// src/types/api.ts
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
  locations?: string[];
  search?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// src/types/operations.ts
export interface CreateServiceInput {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  pricing: {
    basePrice: number;
    currency: string;
    priceType: "fixed" | "hourly" | "starting-from";
    packages?: Array<{
      name: string;
      price: number;
      description: string;
      features: string[];
    }>;
  };
  provider: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
    experience: string;
    location: string;
  };
  images: string[];
  tags: string[];
  locations: string[];
  deliveryTime: {
    min: number;
    max: number;
    unit: "hours" | "days" | "weeks";
  };
  features: string[];
  requirements?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  isActive?: boolean;
  popular?: boolean;
}

export interface UpdateServiceInput {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  longDescription?: string;
  categoryId?: string;
  pricing?: {
    basePrice: number;
    currency: string;
    priceType: "fixed" | "hourly" | "starting-from";
    packages?: Array<{
      name: string;
      price: number;
      description: string;
      features: string[];
    }>;
  };
  provider?: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
    experience: string;
    location: string;
  };
  images?: string[];
  tags?: string[];
  locations?: string[];
  deliveryTime?: {
    min: number;
    max: number;
    unit: "hours" | "days" | "weeks";
  };
  features?: string[];
  requirements?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  isActive?: boolean;
  popular?: boolean;
}
