export interface Room {
  id: string;
  roomNumber: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  price: number;
  isBooked: boolean;
  guestName?: string | null;
  guestId?: string | null;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  amenities: string[];
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomStats {
  total: number;
  available: number;
  booked: number;
  occupancyRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface BookingData {
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
}

export type RoomType = 'single' | 'double' | 'suite' | 'deluxe';

export interface RoomFilters {
  type?: RoomType;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RoomDetails extends Room {
  images?: string[];
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  features?: string[];
  nearbyAttractions?: string[];
}