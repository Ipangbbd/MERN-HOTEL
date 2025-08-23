import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Room, RoomStats, ApiResponse } from '../types/room';
import { roomService } from '../services/roomService';

interface RoomState {
  rooms: Room[];
  stats: RoomStats | null;
  loading: boolean;
  error: string | null;
}

type RoomAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'SET_STATS'; payload: RoomStats }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: Room }
  | { type: 'DELETE_ROOM'; payload: string };

const initialState: RoomState = {
  rooms: [],
  stats: null,
  loading: false,
  error: null,
};

const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload, loading: false, error: null };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.id ? action.payload : room
        ),
      };
    case 'DELETE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
      };
    default:
      return state;
  }
};

interface RoomContextType extends RoomState {
  fetchRooms: (filters?: any) => Promise<void>;
  fetchStats: () => Promise<void>;
  createRoom: (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRoom: (id: string, roomData: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  bookRoom: (id: string, bookingData: any) => Promise<void>;
  checkoutRoom: (id: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initialState);

  const fetchRooms = async (filters?: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await roomService.getRooms(filters);
      dispatch({ type: 'SET_ROOMS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch rooms' });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await roomService.getStats();
      dispatch({ type: 'SET_STATS', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const createRoom = async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await roomService.createRoom(roomData);
      dispatch({ type: 'ADD_ROOM', payload: response.data });
      await fetchStats(); // Refresh stats
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create room');
    }
  };

  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    try {
      const response = await roomService.updateRoom(id, roomData);
      dispatch({ type: 'UPDATE_ROOM', payload: response.data });
      await fetchStats(); // Refresh stats
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await roomService.deleteRoom(id);
      dispatch({ type: 'DELETE_ROOM', payload: id });
      await fetchStats(); // Refresh stats
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const bookRoom = async (id: string, bookingData: any) => {
    try {
      const response = await roomService.bookRoom(id, bookingData);
      dispatch({ type: 'UPDATE_ROOM', payload: response.data });
      await fetchStats(); // Refresh stats
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to book room');
    }
  };

  const checkoutRoom = async (id: string) => {
    try {
      const response = await roomService.checkoutRoom(id);
      dispatch({ type: 'UPDATE_ROOM', payload: response.data });
      await fetchStats(); // Refresh stats
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to checkout room');
    }
  };

  // Auto-refresh data every 30 seconds for real-time updates
  useEffect(() => {
    fetchRooms();
    fetchStats();
    
    const interval = setInterval(() => {
      fetchRooms();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const contextValue: RoomContextType = {
    ...state,
    fetchRooms,
    fetchStats,
    createRoom,
    updateRoom,
    deleteRoom,
    bookRoom,
    checkoutRoom,
  };

  return (
    <RoomContext.Provider value={contextValue}>
      {children}
    </RoomContext.Provider>
  );
};