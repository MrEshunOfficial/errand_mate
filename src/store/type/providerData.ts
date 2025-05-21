import { Types } from "mongoose";

export interface serviceProviderData {
  userId: string;
  fullName: string;
  contactDetails: {
    primaryContact: string;
    secondaryContact: string;
    emergencyContact: string;
    email: string;
  };
  witnessDetails: {
    fullName: string;
    phone: string;
    IdType: string;
    IdNumber: string;
    relationship: string;
  }[];
  idDetails: {
    idType: string;
    idNumber: string;
    idFile: {
      url: string;
      fileName: string;
    };
  };
  location: {
    gpsAddress: string;
    nearbyLandmark: string;
    region: string;
    city: string;
    district: string;
    locality: string;
  };
  profilePicture: {
    url: string;
    fileName: string;
  };
  serviceRendering: {
    serviceId: Types.ObjectId;
    serviceCategory: string;
    serviceIcon: string;
    serviceName: string;
  };
  serviceHistory?: {
    requestId: Types.ObjectId;
    serviceId: Types.ObjectId;
    serviceCategory: string;
    serviceIcon: string;
    serviceName: string;
    date: Date;
    status: string;
    requestNumber: string;
    serviceProvider: {
      providerId: string;
      name: string;
      phone: string;
      email: string;
      profilePicture: {
        url: string;
        fileName: string;
      };
    };
  }[];
  clientRating?: {
    clientId: Types.ObjectId;
    requestId: Types.ObjectId;
    serviceId: Types.ObjectId;
    rating: number;
    review: string;
    date: Date;
  }[];
  socialMediaHandles?: {
    nameOfSocial: string;
    userName: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
