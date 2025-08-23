import { Room, RoomStats, ApiResponse } from '../types/room';

const API_BASE_URL = 'http://localhost:5000/api';

class RoomService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getRooms(filters?: {
    type?: string;
    available?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<ApiResponse<Room[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/rooms${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Room[]>(endpoint);
  }

  async getStats(): Promise<ApiResponse<RoomStats>> {
    return this.request<RoomStats>('/rooms/stats');
  }

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/rooms/${id}`);
  }

  async createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Room>> {
    return this.request<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async updateRoom(id: string, roomData: Partial<Room>): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  }

  async deleteRoom(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  async bookRoom(id: string, bookingData: {
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
  }): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/rooms/${id}/book`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async checkoutRoom(id: string): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/rooms/${id}/checkout`, {
      method: 'POST',
    });
  }
}

export const roomService = new RoomService();