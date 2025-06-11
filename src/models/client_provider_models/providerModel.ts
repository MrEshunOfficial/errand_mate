// src/models/ServiceProvider.ts
import { ServiceProviderData, WitnessDetails } from '@/store/type/client_provider_Data';
import mongoose, { Schema, Model } from 'mongoose';

const ProviderContactDetailsSchema = new Schema({
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
  },
  emergencyContact: { 
    type: String, 
    required: true,
    trim: true 
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

// Fixed: Changed from LocationSchema to clientLocationSchema to match interface
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

const WitnessDetailsSchema = new Schema({
  fullName: { 
    type: String, 
    required: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: true,
    trim: true 
  },
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
  relationship: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { _id: false });

const ProviderServiceRequestSchema = new Schema({
  requestId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    default: () => new mongoose.Types.ObjectId() // Fixed: Generate ObjectId properly
  },
  serviceId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Service'
  },
  clientId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Client'
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
  }
}, { _id: false });

const ProviderRatingSchema = new Schema({
  serviceId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Service'
  },
  clientId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Client'
  },
  requestId: { 
    type: Schema.Types.ObjectId, 
    required: true
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
  }
}, { _id: false });

const ServiceProviderSchema = new Schema<ServiceProviderData>({
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
    type: ProviderContactDetailsSchema,
    required: true
  },
  witnessDetails: {
    type: [WitnessDetailsSchema],
    required: true,
    validate: {
      validator: function(witnesses: WitnessDetails[]) {
        return witnesses && witnesses.length >= 1;
      },
      message: 'At least one witness is required'
    }
  },
  idDetails: {
    type: IdDetailsSchema,
    required: true
  },
  location: { // Fixed: Updated field name to match TypeScript interface
    type: clientLocationSchema,
    required: true
  },
  profilePicture: {
    type: ProfilePictureSchema,
    required: true
  },
  serviceRendering: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
    // Removed required: true from array items - this should be handled at document level
  }],
  socialMediaHandles: [SocialMediaHandleSchema],
  serviceHistory: [ProviderServiceRequestSchema],
  clientRating: [ProviderRatingSchema]
}, {
  timestamps: true,
  collection: 'serviceproviders'
});

// Indexes for performance optimization
ServiceProviderSchema.index({ userId: 1 }, { unique: true });
ServiceProviderSchema.index({ 'contactDetails.email': 1 }, { unique: true });
ServiceProviderSchema.index({ 'contactDetails.primaryContact': 1 });
ServiceProviderSchema.index({ 'contactDetails.emergencyContact': 1 });
ServiceProviderSchema.index({ 'idDetails.idNumber': 1 });
ServiceProviderSchema.index({ 'location.region': 1, 'location.city': 1 });
ServiceProviderSchema.index({ fullName: 'text' });
ServiceProviderSchema.index({ serviceRendering: 1 });
ServiceProviderSchema.index({ 'serviceHistory.status': 1 });
ServiceProviderSchema.index({ 'serviceHistory.date': -1 });
ServiceProviderSchema.index({ 'serviceHistory.requestNumber': 1 });
ServiceProviderSchema.index({ 'witnessDetails.idNumber': 1 });

// Compound indexes for common queries
ServiceProviderSchema.index({ 
  'location.region': 1, 
  'location.city': 1, 
  'location.district': 1 
});
ServiceProviderSchema.index({ 
  serviceRendering: 1, 
  'location.region': 1, 
  'location.city': 1 
});
ServiceProviderSchema.index({ 
  'serviceHistory.clientId': 1, 
  'serviceHistory.status': 1 
});
ServiceProviderSchema.index({ 
  'clientRating.rating': -1, 
  serviceRendering: 1 
});

// Pre-save middleware for validation
ServiceProviderSchema.pre('save', function(next) {
  // Ensure at least one service is being rendered (only if serviceRendering is defined)
  if (this.serviceRendering !== undefined && this.serviceRendering.length === 0) {
    return next(new Error('At least one service must be selected'));
  }

  // Ensure requestNumbers are unique across all service requests
  if (this.serviceHistory && this.serviceHistory.length > 0) {
    const requestNumbers = this.serviceHistory.map(req => req.requestNumber);
    const uniqueRequestNumbers = [...new Set(requestNumbers)];
    
    if (requestNumbers.length !== uniqueRequestNumbers.length) {
      return next(new Error('Duplicate request numbers found'));
    }
  }

  // Ensure witness ID numbers are unique
  if (this.witnessDetails && this.witnessDetails.length > 0) {
    const witnessIds = this.witnessDetails.map(witness => witness.idNumber);
    const uniqueWitnessIds = [...new Set(witnessIds)];
    
    if (witnessIds.length !== uniqueWitnessIds.length) {
      return next(new Error('Duplicate witness ID numbers found'));
    }
  }

  next();
});

// Check if model already exists to prevent re-compilation issues
const ServiceProviderModel: Model<ServiceProviderData> = mongoose.models.ServiceProvider || mongoose.model<ServiceProviderData>('ServiceProvider', ServiceProviderSchema);

export default ServiceProviderModel;