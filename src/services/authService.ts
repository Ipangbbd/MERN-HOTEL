import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        credentials: 'include', // Include cookies
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    return this.request<{ success: boolean; data: User }>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<{ success: boolean; data: User; message: string }> {
    return this.request<{ success: boolean; data: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

export const authService = new AuthService();