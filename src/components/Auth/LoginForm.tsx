import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../UI/Toaster";
import LoadingSpinner from "../UI/LoadingSpinner";

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onClose,
}) => {
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      await login(formData);
      showToast("Welcome back!", "success");
      onClose();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role: "admin" | "guest") => {
    if (role === "admin") {
      setFormData({
        email: "admin@hotel.com",
        password: "admin123",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" color="text-white" />
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-3 font-medium">
          Demo Credentials:
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-blue-600">Admin:</span>{" "}
            admin@hotel.com / admin123
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
