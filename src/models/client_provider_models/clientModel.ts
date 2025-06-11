// src/models/Client.ts
import { ClientData } from '@/store/type/client_provider_Data';
import mongoose, { Schema, Model } from 'mongoose';

const ContactDetailsSchema = new Schema({
  primaryContact: { 
    type: String, 
    required: true,
    trim: true 
  },
  secondaryContact: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  }
}, { _id: false });

const IdDetailsSchema = new Schema({
  idType: {
    type: String, 
    required: true,
    trim: true 
  },
  idNumber: { 
    type: String, 
    required: true,
    trim: true 
  },
  idFile: {
    url: { 
      type: String, 
      required: true 
    },
    fileName: { 
      type: String, 
      required: true 
    }
  }
}, { _id: false });

const clientLocationSchema = new Schema({
  gpsAddress: { 
    type: String, 
    required: true,
    trim: true 
  },
  nearbyLandmark: { 
    type: String, 
    required: true,
    trim: true 
  },
  region: { 
    type: String, 
    required: true,
    trim: true 
  },
  city: { 
    type: String, 
    required: true,
    trim: true 
  },
  district: { 
    type: String, 
    required: true,
    trim: true 
  },
  locality: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { _id: false });

const ProfilePictureSchema = new Schema({
  url: { 
    type: String, 
    required: true 
  },
  fileName: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const SocialMediaHandleSchema = new Schema({
  nameOfSocial: { 
    type: String, 
    required: true,
    trim: true 
  },
  userName: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { _id: false });

const ServiceProviderInfoSchema = new Schema({
  providerId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'ServiceProvider'
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true 
  },
  profilePicture: ProfilePictureSchema
}, { _id: false });

const ClientServiceRequestSchema = new Schema({
  requestId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    default: () => new mongoose.Types.ObjectId()
  },
  serviceId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Service'
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestNumber: { 
    type: String, 
    required: true,
    trim: true 
  },
  serviceProvider: ServiceProviderInfoSchema
}, { _id: false });

const ServiceRatingSchema = new Schema({
  serviceId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Service'
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  review: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  // Added providerId field as per TypeScript interface
  providerId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'ServiceProvider'
  }
}, { _id: false });

const ClientSchema = new Schema<ClientData>({
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    index: true
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  },
  contactDetails: {
    type: ContactDetailsSchema,
    required: true
  },
  idDetails: {
    type: IdDetailsSchema,
    required: true
  },
  location: {
    type: clientLocationSchema,
    required: true
  },
  profilePicture: {
    type: ProfilePictureSchema,
    required: true
  },
  socialMediaHandles: [SocialMediaHandleSchema],
  serviceRequestHistory: [ClientServiceRequestSchema],
  serviceProviderRating: [ServiceRatingSchema]
}, {
  timestamps: true,
  collection: 'clients'
});

// Indexes for performance optimization
ClientSchema.index({ userId: 1 }, { unique: true });
ClientSchema.index({ 'contactDetails.email': 1 }, { unique: true });
ClientSchema.index({ 'contactDetails.primaryContact': 1 });
ClientSchema.index({ 'idDetails.idNumber': 1 });
ClientSchema.index({ 'location.region': 1, 'location.city': 1 });
ClientSchema.index({ fullName: 'text' });
ClientSchema.index({ 'serviceRequestHistory.status': 1 });
ClientSchema.index({ 'serviceRequestHistory.date': -1 });
ClientSchema.index({ 'serviceRequestHistory.requestNumber': 1 });


ClientSchema.index({ 
  'location.region': 1, 
  'location.city': 1, 
  'location.district': 1 
});
ClientSchema.index({ 
  'serviceRequestHistory.serviceProvider.providerId': 1, 
  'serviceRequestHistory.status': 1 
});
ClientSchema.pre('save', function(next) {
  // Ensure requestNumbers are unique across all service requests
  if (this.serviceRequestHistory && this.serviceRequestHistory.length > 0) {
    const requestNumbers = this.serviceRequestHistory.map(req => req.requestNumber);
    const uniqueRequestNumbers = [...new Set(requestNumbers)];
    
    if (requestNumbers.length !== uniqueRequestNumbers.length) {
      return next(new Error('Duplicate request numbers found'));
    }
  }
  next();
});

const ClientModel: Model<ClientData> = mongoose.models.Client || mongoose.model<ClientData>('Client', ClientSchema);

export default ClientModel;