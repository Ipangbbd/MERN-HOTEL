import React, { createContext, useContext, useReducer, useEffect } from "react";
import { User, AuthState, LoginCredentials, RegisterData } from "../types/auth";
import { authService } from "../services/authService";

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        dispatch({ type: "SET_USER", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_USER", payload: null });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authService.login(credentials);
      dispatch({ type: "SET_USER", payload: response.data.user });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authService.register(userData);
      dispatch({ type: "SET_USER", payload: response.data.user });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(userData);
      dispatch({ type: "SET_USER", payload: response.data });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
