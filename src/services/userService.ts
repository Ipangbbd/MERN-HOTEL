import { User, UserStats } from "../types/auth";
import { ApiResponse } from "../types/room";

const API_BASE_URL = "http://localhost:5000/api";

class UserService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getUsers(filters?: {
    role?: string;
    active?: boolean;
    search?: string;
  }): Promise<ApiResponse<User[]>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ""}`;

    return this.request<ApiResponse<User[]>>(endpoint);
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.request<ApiResponse<UserStats>>("/users/stats");
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/users/${id}`);
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">
  ): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/users/${id}`, {
      method: "DELETE",
    });
  }
}

export const userService = new UserService();
