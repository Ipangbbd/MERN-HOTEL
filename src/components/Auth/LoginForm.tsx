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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 mb-6">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2 uppercase tracking-wide">
          Welcome Back
        </h2>
        <p className="text-neutral-600 font-medium">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-4 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
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
          className="w-full bg-neutral-900 text-white py-4 px-6 font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
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
      <div className="mt-8 p-4 bg-neutral-50 border border-neutral-200">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Demo Credentials:
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="w-full text-left px-4 py-3 text-sm bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors font-medium"
          >
            <span className="font-bold text-neutral-900 uppercase tracking-wide">Admin:</span>{" "}
            admin@hotel.com / admin123
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-neutral-600 font-medium">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-neutral-900 hover:text-neutral-700 font-semibold transition-colors underline decoration-dotted underline-offset-4 hover:decoration-solid uppercase tracking-wide"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;