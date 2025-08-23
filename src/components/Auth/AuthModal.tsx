import React, { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="p-8">
          {mode === "login" ? (
            <LoginForm
              onSwitchToRegister={() => setMode("register")}
              onClose={onClose}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={() => setMode("login")}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
