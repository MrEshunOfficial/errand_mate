// src/services/clientServices.ts
import ClientModel from '@/models/client_provider_models/clientModel';
import { 
  CreateClientInput, 
  ClientData, 
  UpdateClientInput, 
  ClientServiceRequest, 
  ServiceRating 
} from '@/store/type/client_provider_Data';
import { PipelineStage, Types } from 'mongoose';

// Define error types for better error handling
interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

// Define query interface for better type safety
interface LocationQuery {
  'location.region'?: string | { $regex: string; $options: string };
  'location.city'?: string | { $regex: string; $options: string };
  'location.district'?: string | { $regex: string; $options: string };
  'location.locality'?: string | { $regex: string; $options: string };
}

interface ClientQuery extends LocationQuery {
  $or?: Array<{
    fullName?: { $regex: string; $options: string };
    'contactDetails.email'?: { $regex: string; $options: string };
  }>;
  userId?: string;
  'contactDetails.email'?: string;
}

interface ClientExistsQuery {
  $or?: Array<{
    userId?: string;
    'contactDetails.email'?: string;
  }>;
  userId?: string;
  'contactDetails.email'?: string;
}

export class ClientServices {
  
  /**
   * Create a new client
   */
  static async createClient(clientData: CreateClientInput): Promise<ClientData> {
    try {
      const newClient = new ClientModel(clientData);
      const savedClient = await newClient.save();
      return savedClient.toObject();
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError.code === 11000 && mongoError.keyPattern) {
        const field = Object.keys(mongoError.keyPattern)[0];
        throw new Error(`Client with this ${field} already exists`);
      }
      throw new Error(`Failed to create client: ${mongoError.message || 'Unknown error'}`);
    }
  }

  /**
   * Get client by ID
   */
  static async getClientById(clientId: string): Promise<ClientData | null> {
    try {
      if (!Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid client ID format');
      }
      
      const client = await ClientModel.findById(clientId).lean();
      return client;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get client: ${err.message}`);
    }
  }

  /**
   * Get client by userId
   */
  static async getClientByUserId(userId: string): Promise<ClientData | null> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }
      
      const client = await ClientModel.findOne({ userId }).lean();
      return client;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get client by userId: ${err.message}`);
    }
  }

  /**
   * Get client by email
   */
  static async getClientByEmail(email: string): Promise<ClientData | null> {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Invalid email provided');
      }
      
      const client = await ClientModel.findOne({ 
        'contactDetails.email': email.toLowerCase() 
      }).lean();
      return client;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get client by email: ${err.message}`);
    }
  }

  /**
   * Update client information
   */
  static async updateClient(clientId: string, updateData: Partial<UpdateClientInput>): Promise<ClientData | null> {
    try {
      if (!Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid client ID format');
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required');
      }

      const updatedClient = await ClientModel.findByIdAndUpdate(
        clientId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedClient) {
        throw new Error('Client not found');
      }

      return updatedClient;
    } catch (error) {
      const mongoError = error as MongoError;
      if (mongoError.code === 11000 && mongoError.keyPattern) {
        const field = Object.keys(mongoError.keyPattern)[0];
        throw new Error(`Client with this ${field} already exists`);
      }
      throw new Error(`Failed to update client: ${mongoError.message || 'Unknown error'}`);
    }
  }

  /**
   * Delete client
   */
  static async deleteClient(clientId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid client ID format');
      }

      const result = await ClientModel.findByIdAndDelete(clientId);
      return !!result;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to delete client: ${err.message}`);
    }
  }

  /**
   * Get all clients with pagination and filtering
   */
  static async getAllClients(options: {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
    city?: string;
    district?: string;
  } = {}): Promise<{ clients: ClientData[]; total: number; page: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        region,
        city,
        district
      } = options;

      // Validate pagination parameters
      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive numbers');
      }

      const skip = (page - 1) * limit;
      const query: ClientQuery = {};

      // Search by name or email
      if (search && typeof search === 'string') {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { 'contactDetails.email': { $regex: search, $options: 'i' } }
        ];
      }

      // Location filters
      if (region && typeof region === 'string') query['location.region'] = region;
      if (city && typeof city === 'string') query['location.city'] = city;
      if (district && typeof district === 'string') query['location.district'] = district;

      const [clients, total] = await Promise.all([
        ClientModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        ClientModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        clients,
        total,
        page,
        totalPages
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get clients: ${err.message}`);
    }
  }

  /**
   * Add service request to client history
   */
  static async addServiceRequest(
    clientId: string, 
    serviceRequest: Omit<ClientServiceRequest, 'requestId' | 'date'>
  ): Promise<ClientData | null> {
    try {
      if (!Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid client ID format');
      }

      if (!serviceRequest || !serviceRequest.serviceId || !serviceRequest.requestNumber) {
        throw new Error('Service request data is incomplete');
      }

      const newRequest: ClientServiceRequest = {
        ...serviceRequest,
        requestId: new Types.ObjectId(),
        date: new Date()
      };

      const updatedClient = await ClientModel.findByIdAndUpdate(
        clientId,
        { $push: { serviceRequestHistory: newRequest } },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedClient) {
        throw new Error('Client not found');
      }

      return updatedClient;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to add service request: ${err.message}`);
    }
  }

  /**
   * Update service request status
   */
  static async updateServiceRequestStatus(
    clientId: string,
    requestId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ): Promise<ClientData | null> {
    try {
      if (!Types.ObjectId.isValid(clientId) || !Types.ObjectId.isValid(requestId)) {
        throw new Error('Invalid ID format');
      }

      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status provided');
      }

      const updatedClient = await ClientModel.findOneAndUpdate(
        { 
          _id: clientId,
          'serviceRequestHistory.requestId': requestId
        },
        { 
          $set: { 
            'serviceRequestHistory.$.status': status,
            updatedAt: new Date()
          }
        },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedClient) {
        throw new Error('Client or service request not found');
      }

      return updatedClient;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to update service request status: ${err.message}`);
    }
  }

 /**
 * Get client service request history
 */
static async getServiceRequestHistory(
  clientId: string,
  options: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{ requests: ClientServiceRequest[]; total: number }> {
  try {
    if (!Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid client ID format');
    }

    const { status, page = 1, limit = 10 } = options;
    
    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive numbers');
    }

    const skip = (page - 1) * limit;

    // Use Record<string, any> which is compatible with Mongoose PipelineStage
    const pipeline: PipelineStage[] = [
  { $match: { _id: new Types.ObjectId(clientId) } },
  { $unwind: '$serviceRequestHistory' }
  ];

    // Add status filter if provided
    if (status && typeof status === 'string') {
      const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status filter');
      }
      pipeline.push({
        $match: { 'serviceRequestHistory.status': status }
      });
    }

    // Add remaining pipeline stages
    pipeline.push(
      { $sort: { 'serviceRequestHistory.date': -1 } },
      {
        $group: {
          _id: '$_id',
          requests: { $push: '$serviceRequestHistory' },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          requests: { $slice: ['$requests', skip, limit] },
          total: 1
        }
      }
    );

    const result = await ClientModel.aggregate(pipeline);
    
    if (!result.length) {
      return { requests: [], total: 0 };
    }

    return {
      requests: result[0].requests || [],
      total: result[0].total || 0
    };
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to get service request history: ${err.message}`);
  }
}

  /**
   * Add service provider rating
   */
  static async addServiceProviderRating(
    clientId: string,
    rating: Omit<ServiceRating & { providerId: Types.ObjectId }, 'date'>
  ): Promise<ClientData | null> {
    try {
      if (!Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid client ID format');
      }

      if (!rating || typeof rating.rating !== 'number' || rating.rating < 1 || rating.rating > 5) {
        throw new Error('Invalid rating data: rating must be between 1 and 5');
      }

      if (!rating.review || typeof rating.review !== 'string') {
        throw new Error('Review is required');
      }

      const newRating = {
        ...rating,
        date: new Date()
      };

      const updatedClient = await ClientModel.findByIdAndUpdate(
        clientId,
        { $push: { serviceProviderRating: newRating } },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedClient) {
        throw new Error('Client not found');
      }

      return updatedClient;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to add service provider rating: ${err.message}`);
    }
  }

  /**
   * Get client statistics
   */
  static async getClientStats(clientId: string): Promise<{
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    cancelledRequests: number;
    averageRating: number;
    totalRatingsGiven: number;
  }> {
    try {
      if (!Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid client ID format');
      }

      const pipeline = [
        { $match: { _id: new Types.ObjectId(clientId) } },
        {
          $project: {
            serviceRequestHistory: 1,
            serviceProviderRating: 1,
            totalRequests: { $size: { $ifNull: ['$serviceRequestHistory', []] } },
            completedRequests: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$serviceRequestHistory', []] },
                  cond: { $eq: ['$$this.status', 'completed'] }
                }
              }
            },
            pendingRequests: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$serviceRequestHistory', []] },
                  cond: { $eq: ['$$this.status', 'pending'] }
                }
              }
            },
            cancelledRequests: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$serviceRequestHistory', []] },
                  cond: { $eq: ['$$this.status', 'cancelled'] }
                }
              }
            },
            totalRatingsGiven: { $size: { $ifNull: ['$serviceProviderRating', []] } },
            averageRating: {
              $cond: {
                if: { $gt: [{ $size: { $ifNull: ['$serviceProviderRating', []] } }, 0] },
                then: { $avg: '$serviceProviderRating.rating' },
                else: 0
              }
            }
          }
        }
      ];

      const result = await ClientModel.aggregate(pipeline);
      
      if (!result.length) {
        throw new Error('Client not found');
      }

      return result[0];
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get client statistics: ${err.message}`);
    }
  }

  /**
   * Search clients by location
   */
  static async searchClientsByLocation(
    region?: string,
    city?: string,
    district?: string,
    locality?: string
  ): Promise<ClientData[]> {
    try {
      const query: LocationQuery = {};
      
      if (region && typeof region === 'string') {
        query['location.region'] = { $regex: region, $options: 'i' };
      }
      if (city && typeof city === 'string') {
        query['location.city'] = { $regex: city, $options: 'i' };
      }
      if (district && typeof district === 'string') {
        query['location.district'] = { $regex: district, $options: 'i' };
      }
      if (locality && typeof locality === 'string') {
        query['location.locality'] = { $regex: locality, $options: 'i' };
      }

      // If no filters provided, return empty array
      if (Object.keys(query).length === 0) {
        return [];
      }

      const clients = await ClientModel.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return clients;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to search clients by location: ${err.message}`);
    }
  }

  /**
   * Check if client exists by userId or email
   */
  static async checkClientExists(userId?: string, email?: string): Promise<boolean> {
    try {
      if (!userId && !email) {
        throw new Error('Either userId or email must be provided');
      }

      const query: ClientExistsQuery = {};
      
      if (userId && email) {
        query.$or = [
          { userId },
          { 'contactDetails.email': email.toLowerCase() }
        ];
      } else if (userId) {
        query.userId = userId;
      } else if (email) {
        query['contactDetails.email'] = email.toLowerCase();
      }

      const client = await ClientModel.findOne(query).select('_id').lean();
      return !!client;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to check client existence: ${err.message}`);
    }
  }
}