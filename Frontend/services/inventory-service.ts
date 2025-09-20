import api from './api-config';

export interface InventoryUpdateResponse {
  id: string;
  quantity: number;
  message: string;
}

const inventoryService = {
  // Purchase a sweet (decreases quantity)
  purchaseSweet: async (id: string, quantity: number): Promise<InventoryUpdateResponse> => {
    const response = await api.post<InventoryUpdateResponse>(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  // Restock a sweet (increases quantity) - Admin only
  restockSweet: async (id: string, quantity: number): Promise<InventoryUpdateResponse> => {
    const response = await api.post<InventoryUpdateResponse>(`/sweets/${id}/restock`, { quantity });
    return response.data;
  }
};

export default inventoryService;