import { useState } from 'react';

export type AppView = 'home' | 'admin' | 'room-details';

export const useApp = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return {
    currentView,
    setCurrentView,
    selectedRoomId,
    setSelectedRoomId,
  };
};