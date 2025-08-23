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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Grandeur Hotel</h1>
              <p className="text-sm text-gray-600">Luxury & Comfort</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setCurrentView('home')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    currentView === 'home'
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Rooms</span>
                </button>
                
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentView === 'admin'
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
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
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
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