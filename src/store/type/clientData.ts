import { Types } from "mongoose";

export interface clientData {
  userId: string;
  fullName: string;
  contactDetails: {
    primaryContact: string;
    secondaryContact: string;
    email: string;
  };
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
  serviceRequestHistory?: {
    requestId: Types.ObjectId;
    serviceId: Types.ObjectId;
    serviceCategory: string;
    serviceIcon: string;
    serviceName: string;
    date: Date;
    status: string;
    requestNumber: string;
    serviceProvider: {
      providerId: Types.ObjectId;
      name: string;
      phone: string;
      email: string;
      profilePicture: {
        url: string;
        fileName: string;
      };
    };
  }[];
  serviceProviderRating?: {
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
