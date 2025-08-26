import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../UI/Toaster";
import LoadingSpinner from "../UI/LoadingSpinner";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onClose,
}) => {
  const { register, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      showToast("Account created successfully! Welcome!", "success");
      onClose();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 mb-6">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2 uppercase tracking-wide">
          Join Us
        </h2>
        <p className="text-neutral-600 font-medium">Create your account to get started</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Email Address *
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
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full pl-12 pr-4 py-4 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
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

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full pl-12 pr-12 py-4 border border-neutral-300 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showConfirmPassword ? (
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
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-neutral-600 font-medium">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-neutral-900 hover:text-neutral-700 font-semibold transition-colors underline decoration-dotted underline-offset-4 hover:decoration-solid uppercase tracking-wide"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;