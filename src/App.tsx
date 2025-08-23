import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { RoomProvider } from './context/RoomContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Hero from './components/Hero/Hero';
import RoomGrid from './components/Rooms/RoomGrid';
import AdminPanel from './components/Admin/AdminPanel';
import RoomDetailsPage from './components/Rooms/RoomDetailsPage';
import Footer from './components/Layout/Footer';
import AuthModal from './components/Auth/AuthModal';
import ToasterWrapper from './components/UI/Toaster';
import { useApp } from './hooks/useApp';

function AppContent() {
  const { currentView, setCurrentView, selectedRoomId, setSelectedRoomId } = useApp();
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');

  const handleAuthClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleViewRoomDetails = (roomId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedRoomId(roomId);
    setCurrentView('room-details');
  };

  const handleBackToHome = () => {
    setSelectedRoomId(null);
    setCurrentView('home');
  };

  // Redirect non-admin users away from admin panel
  React.useEffect(() => {
    if (currentView === 'admin' && (!isAuthenticated || user?.role !== 'admin')) {
      setCurrentView('home');
    }
  }, [currentView, isAuthenticated, user, setCurrentView]);

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'room-details' && (
        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          onAuthClick={handleAuthClick}
        />
      )}
      
      {currentView === 'home' && (
        <>
          <Hero />
          {isAuthenticated && <RoomGrid onViewRoomDetails={handleViewRoomDetails} />}
        </>
      )}
      
      {currentView === 'admin' && isAuthenticated && user?.role === 'admin' && (
        <AdminPanel />
      )}
      
      {currentView === 'room-details' && selectedRoomId && (
        <RoomDetailsPage roomId={selectedRoomId} onBack={handleBackToHome} />
      )}
      
      {currentView !== 'room-details' && <Footer />}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}

function App() {
  return (
    <ToasterWrapper>
      <AuthProvider>
        <RoomProvider>
          <AppContent />
        </RoomProvider>
      </AuthProvider>
    </ToasterWrapper>
  );
}

export default App;