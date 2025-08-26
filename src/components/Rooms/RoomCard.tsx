import React from 'react';
import { Calendar, Users, Wifi, Car, Coffee, Star, MapPin, Eye, Info } from 'lucide-react';
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
    <div className="group bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-300 overflow-hidden">
      {/* Room Image with View Details Overlay */}
      <div className="relative h-56 overflow-hidden cursor-pointer" onClick={onViewDetails}>
        <img
          src={room.imageUrl || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/20">
            <Eye className="h-4 w-4 text-neutral-700" />
            <span className="text-neutral-900 font-medium text-sm">View Details</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border ${
              room.isBooked
                ? 'bg-red-600/90 text-white border-red-600/20'
                : 'bg-emerald-600/90 text-white border-emerald-600/20'
            }`}
          >
            {room.isBooked ? 'Occupied' : 'Available'}
          </div>
        </div>

        {/* Room Type Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center space-x-2 border border-white/20">
            {getRoomTypeIcon(room.type)}
            <span className="text-neutral-800 text-xs font-semibold uppercase tracking-wider">{room.type}</span>
          </div>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-3 border border-white/20">
            <div className="text-xl font-bold text-neutral-900">${room.price}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">per night</div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 uppercase tracking-wide mb-1">
              Room {room.roomNumber}
            </h3>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-600 text-amber-600" />
              ))}
            </div>
          </div>
          <button
            onClick={onViewDetails}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-all duration-200 group/btn"
            title="View room details"
          >
            <Info className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
          </button>
        </div>

        <p className="text-neutral-600 text-sm mb-6 leading-relaxed">{room.description}</p>

        {/* Amenities */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Amenities
          </div>
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5"
              >
                {getAmenityIcon(amenity)}
                <span className="text-xs text-neutral-700 font-medium">{amenity}</span>
              </div>
            ))}
            {room.amenities.length > 4 && (
              <button
                onClick={onViewDetails}
                className="flex items-center space-x-1 bg-neutral-100 border border-neutral-200 px-3 py-1.5 hover:bg-neutral-150 transition-colors duration-200"
                title="View all amenities"
              >
                <span className="text-xs text-neutral-600 font-medium">+{room.amenities.length - 4} more</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Info (if booked) */}
        {room.isBooked && room.guestName && (
          <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200">
            <div className="flex items-start justify-between">
              <div className="text-sm">
                <div className="font-semibold text-neutral-900 uppercase tracking-wide mb-2">
                  Guest: {room.guestName}
                </div>
                <div className="text-neutral-600 text-xs space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-neutral-400" />
                    <span>Check-in: {room.checkInDate ? new Date(room.checkInDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-neutral-400" />
                    <span>Check-out: {room.checkOutDate ? new Date(room.checkOutDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onViewDetails}
                className="text-neutral-400 hover:text-neutral-700 transition-colors duration-200"
                title="View booking details"
              >
                <Info className="h-4 w-4" />
              </button>
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
                  className="flex-1 bg-red-600 text-white py-3 px-4 font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{user?.role === 'admin' && !isCurrentUserBooking ? 'Admin Checkout' : 'Check Out'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-neutral-400 text-white py-3 px-4 font-semibold cursor-not-allowed flex items-center justify-center space-x-2 uppercase tracking-wide text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Occupied</span>
                </button>
              )}
              <button
                onClick={onViewDetails}
                className="px-4 py-3 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 flex items-center justify-center group/view"
                title="View room details"
              >
                <Eye className="h-4 w-4 text-neutral-600 group-hover/view:text-neutral-900 group-hover/view:scale-110 transition-all duration-200" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onBook}
                className="flex-1 bg-neutral-900 text-white py-3 px-4 font-semibold hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide text-sm"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </button>
              <button
                onClick={onViewDetails}
                className="px-4 py-3 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 flex items-center justify-center group/view"
                title="View room details"
              >
                <Eye className="h-4 w-4 text-neutral-600 group-hover/view:text-neutral-900 group-hover/view:scale-110 transition-all duration-200" />
              </button>
            </>
          )}
        </div>

        {/* Quick Details Link */}
        <div className="mt-4 text-center">
          <button
            onClick={onViewDetails}
            className="text-xs text-neutral-500 hover:text-neutral-700 font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid transition-all duration-200 uppercase tracking-wider"
          >
            Full Details & Photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;