import React from 'react';
import { 
  Settings, 
  Home, 
  User, 
  LogOut, 
  ChevronRight, 
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { AppView } from '../../hooks/useApp';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../UI/Toaster';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onAuthClick: () => void;
  isHeroView?: boolean;
  showBreadcrumbs?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  setCurrentView, 
  onAuthClick, 
  isHeroView = false,
  showBreadcrumbs = true 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      setCurrentView('home');
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Dashboard', view: 'home' as AppView, icon: Home }
    ];

    if (currentView === 'admin') {
      breadcrumbs.push({ label: 'Administration', view: 'admin' as AppView, icon: Settings });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className={`sticky top-0 z-50 border-b ${
        isHeroView 
          ? 'bg-neutral-900/95 backdrop-blur-sm border-neutral-800' 
          : 'bg-white/95 backdrop-blur-sm border-neutral-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => {
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="flex flex-col">
                <span className={`text-2xl font-bold ${
                  isHeroView ? 'text-white' : 'text-slate-800'
                }`}>
                  my<span className="text-amber-600">/</span>orison
                </span>
                <span className={`text-xs font-sm tracking-wider ${
                  isHeroView ? 'text-neutral-300' : 'text-slate-500'
                }`}>
                  HOSPITALITY
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  {/* Hero Navigation */}
                  {isHeroView && (
                    <div className="flex items-center gap-6">
                      {[
                        { label: 'Rooms', href: '#rooms' },
                        { label: 'Dining', href: '#dining' },
                        { label: 'Wellness', href: '#wellness' },
                        { label: 'About', href: '#about' }
                      ].map((item) => (
                        <a 
                          key={item.label}
                          href={item.href}
                          className="text-sm text-neutral-300 hover:text-white transition-colors relative group"
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-200 group-hover:w-full"></span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* App Navigation */}
                  {!isHeroView && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentView('home')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
                          currentView === 'home'
                            ? 'text-neutral-900 bg-neutral-100'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                      >
                        <Home size={16} />
                        Rooms
                      </button>
                      
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => setCurrentView('admin')}
                          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
                            currentView === 'admin'
                              ? 'text-neutral-900 bg-neutral-100'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                          }`}
                        >
                          <Settings size={16} />
                          Admin
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : null}

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    {/* Notifications */}
                    <button className={`relative p-2 transition-colors ${
                      isHeroView 
                        ? 'text-neutral-400 hover:text-white' 
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}>
                      <Bell size={18} />
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                          isHeroView
                            ? 'text-neutral-300 hover:text-white'
                            : 'text-neutral-700 hover:text-neutral-900'
                        }`}
                      >
                        <div className="w-6 h-6 bg-neutral-600 flex items-center justify-center text-white text-xs font-semibold">
                          {user?.firstName?.[0]}
                        </div>
                        <span className="hidden sm:block font-medium">
                          {user?.firstName}
                        </span>
                        <ChevronDown size={14} className={`transition-transform ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* User Dropdown */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-neutral-200 shadow-lg z-50">
                          <div className="p-3 border-b border-neutral-100">
                            <div className="font-medium text-neutral-900">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {user?.email}
                            </div>
                            <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wide">
                              {user?.role}
                            </div>
                          </div>
                          
                          <div className="py-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                              <User size={16} />
                              Account Settings
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                              <Bell size={16} />
                              Notifications
                            </button>
                          </div>
                          
                          <div className="border-t border-neutral-100">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <LogOut size={16} />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={onAuthClick}
                    className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isHeroView 
                  ? 'text-neutral-400 hover:text-white' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Breadcrumbs */}
          {!isHeroView && isAuthenticated && showBreadcrumbs && breadcrumbs.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 py-3 border-t border-neutral-100">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.view}>
                  <button
                    onClick={() => setCurrentView(crumb.view)}
                    className={`flex items-center gap-2 px-2 py-1 text-sm transition-colors ${
                      index === breadcrumbs.length - 1
                        ? 'text-neutral-900 font-medium'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <crumb.icon size={14} />
                    {crumb.label}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight size={14} className="text-neutral-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-16">
          <div className="bg-white border-b border-neutral-200">
            <div className="p-4 space-y-4">
              {isAuthenticated ? (
                <>
                  {/* Hero Links */}
                  {isHeroView && (
                    <div className="space-y-2 pb-4 border-b border-neutral-100">
                      {[
                        { label: 'Rooms', href: '#rooms' },
                        { label: 'Dining', href: '#dining' },
                        { label: 'Wellness', href: '#wellness' },
                        { label: 'About', href: '#about' }
                      ].map((item) => (
                        <a 
                          key={item.label}
                          href={item.href}
                          className="block py-2 text-neutral-700 hover:text-neutral-900"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* App Navigation */}
                  {!isHeroView && (
                    <div className="space-y-1 pb-4 border-b border-neutral-100">
                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                          currentView === 'home'
                            ? 'text-neutral-900 bg-neutral-100'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <Home size={18} />
                        Rooms
                      </button>
                      
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                            currentView === 'admin'
                              ? 'text-neutral-900 bg-neutral-100'
                              : 'text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <Settings size={18} />
                          Admin
                        </button>
                      )}
                    </div>
                  )}

                  {/* User Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-600 flex items-center justify-center text-white font-semibold">
                        {user?.firstName?.[0]}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {user?.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-neutral-500 hover:text-neutral-700">
                        <Bell size={18} />
                      </button>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-neutral-500 hover:text-red-600"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;