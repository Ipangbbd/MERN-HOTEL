import React from 'react';
import { Hotel, Settings, Home, User, LogOut } from 'lucide-react';
import { AppView } from '../../hooks/useApp';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../UI/Toaster';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onAuthClick }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      setCurrentView('home');
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <span className="text-2xl font-bold text-gray-800">
              my<span className="text-amber-600">/</span>orison.com
            </span>
          </div>
          
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setCurrentView('home')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 uppercase tracking-wide ${
                    currentView === 'home'
                      ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Rooms</span>
                </button>
                
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 uppercase tracking-wide ${
                      currentView === 'admin'
                        ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}

                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full">
                    <User className="h-4 w-4 text-amber-600" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 uppercase tracking-wide"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;