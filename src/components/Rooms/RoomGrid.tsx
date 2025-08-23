import React, { useState } from 'react';
import { useRoomContext } from '../../context/RoomContext';
import RoomCard from './RoomCard';
import RoomFilters from './RoomFilters';
import BookingModal from './BookingModal';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Room, RoomFilters as RoomFiltersType } from '../../types/room';

interface RoomGridProps {
  onViewRoomDetails: (roomId: string) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({ onViewRoomDetails }) => {
  const { rooms, loading, error, fetchRooms } = useRoomContext();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleFilterChange = async (filters: RoomFiltersType) => {
    await fetchRooms(filters);
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setIsBookingModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">Error Loading Rooms</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchRooms()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Rooms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our selection of luxury accommodations, each designed for comfort and elegance.
          </p>
        </div>

        <RoomFilters onFilterChange={handleFilterChange} />

        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-xl font-semibold mb-4">No rooms found</div>
            <p className="text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onBook={() => handleBookRoom(room)}
                onViewDetails={() => onViewRoomDetails(room.id)}
              />
            ))}
          </div>
        )}

        <BookingModal
          room={selectedRoom}
          isOpen={isBookingModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default RoomGrid;