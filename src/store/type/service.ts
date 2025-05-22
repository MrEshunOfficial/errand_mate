// src/types/service.ts
export interface ServiceCategory {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ServicePricing {
  basePrice: number;
  currency: string;
  percentageCharge?: number;
  additionalFees?: {
    name: string;
    amount: number;
    description?: string;
  }[];
  pricingNotes?: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string; // reference to category id
  icon: string; // icon name or reference
  pricing: ServicePricing;
  locations: string[]; // array of location ids
  popular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
