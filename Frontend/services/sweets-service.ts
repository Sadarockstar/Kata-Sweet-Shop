import api from './api-config';

export interface Sweet {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
}

export interface CreateSweetData {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
}

export interface SearchSweetsParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

const sweetsService = {
  // Get all sweets
  getAllSweets: async (): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets');
    return response.data;
  },

  // Search sweets
  searchSweets: async (params: SearchSweetsParams): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets/search', { params });
    return response.data;
  },

  // Add a new sweet (Admin only)
  createSweet: async (data: CreateSweetData): Promise<Sweet> => {
    const response = await api.post<Sweet>('/sweets', data);
    return response.data;
  },

  // Update a sweet (Admin only)
  updateSweet: async (id: string, data: Partial<CreateSweetData>): Promise<Sweet> => {
    const response = await api.put<Sweet>(`/sweets/${id}`, data);
    return response.data;
  },

  // Delete a sweet (Admin only)
  deleteSweet: async (id: string): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  }
};

export default sweetsService;