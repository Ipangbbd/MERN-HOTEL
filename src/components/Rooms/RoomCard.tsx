import React from 'react';
import { Calendar, Users, Wifi, Car, Coffee, Star, MapPin } from 'lucide-react';
import { Room } from '../../types/room';
import { useRoomContext } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../UI/Toaster';

interface RoomCardProps {
  room: Room;
  onBook: () => void;
  onViewDetails: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, onViewDetails }) => {
  const { checkoutRoom } = useRoomContext();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      await checkoutRoom(room.id);
      showToast('Room checked out successfully!', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  // Check if current user can checkout this room
  const canCheckout = user && (user.id === room.guestId || user.role === 'admin');
  const isCurrentUserBooking = user && user.id === room.guestId;
  
  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'single':
        return <Users className="h-4 w-4" />;
      case 'double':
        return <Users className="h-4 w-4" />;
      case 'suite':
        return <Star className="h-4 w-4" />;
      case 'deluxe':
        return <Star className="h-4 w-4 fill-current" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'room service':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Room Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.imageUrl || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
              room.isBooked
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {room.isBooked ? 'Occupied' : 'Available'}
          </span>
        </div>

        {/* Room Type Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-md px-3 py-1 flex items-center space-x-1">
            {getRoomTypeIcon(room.type)}
            <span className="text-white text-xs font-medium uppercase tracking-wide">{room.type}</span>
          </div>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-2 shadow-lg border border-white/20">
            <div className="text-lg font-bold text-gray-900">${room.price}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">per night</div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Room {room.roomNumber}</h3>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-amber-50 border border-amber-200 rounded-md px-3 py-1"
              >
                {getAmenityIcon(amenity)}
                <span className="text-xs text-amber-700 font-medium">{amenity}</span>
              </div>
            ))}
            {room.amenities.length > 3 && (
              <div className="flex items-center space-x-1 bg-gray-100 border border-gray-200 rounded-md px-3 py-1">
                <span className="text-xs text-gray-700 font-medium">+{room.amenities.length - 3} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Guest Info (if booked) */}
        {room.isBooked && room.guestName && (
          <div className="mb-4 p-3 bg-red-50 rounded-md border border-red-200">
            <div className="text-sm">
              <div className="font-semibold text-red-800 uppercase tracking-wide">Guest: {room.guestName}</div>
              <div className="text-red-600 text-xs mt-1">
                <div>Check-in: {room.checkInDate ? new Date(room.checkInDate).toLocaleDateString() : 'N/A'}</div>
                <div>Check-out: {room.checkOutDate ? new Date(room.checkOutDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {room.isBooked ? (
            <>
              {canCheckout ? (
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{user?.role === 'admin' && !isCurrentUserBooking ? 'Admin Checkout' : 'Check Out'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-gray-200 py-3 px-4 rounded-md font-semibold cursor-not-allowed flex items-center justify-center space-x-2 uppercase tracking-wide"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Booked</span>
                </button>
              )}
              <button
                onClick={onViewDetails}
                className="px-4 py-3 border border-amber-300 rounded-md hover:bg-amber-50 transition-colors duration-200"
              >
                <Star className="h-4 w-4 text-amber-600" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onBook}
                className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </button>
              <button
                onClick={onViewDetails}
                className="px-4 py-3 border border-amber-300 rounded-md hover:bg-amber-50 transition-colors duration-200"
              >
                <Star className="h-4 w-4 text-amber-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;