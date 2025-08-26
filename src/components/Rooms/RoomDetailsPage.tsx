import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Tv, 
  Wind, 
  Bath,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Heart,
  Share2,
  Camera
} from 'lucide-react';
import { Room, Review } from '../../types/room';
import { useRoomContext } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
// import { showToast } from '../UI/Toaster';
import LoadingSpinner from '../UI/LoadingSpinner';
import BookingModal from './BookingModal';

interface RoomDetailsPageProps {
  roomId: string;
  onBack: () => void;
}

const RoomDetailsPage: React.FC<RoomDetailsPageProps> = ({ roomId, onBack }) => {
  const { rooms } = useRoomContext();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data for enhanced room details
  const mockImages = [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      guestName: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely wonderful stay! The room was spotless and the view was breathtaking. Staff was incredibly helpful.',
      date: '2024-01-10'
    },
    {
      id: '2',
      guestName: 'Michael Chen',
      rating: 4,
      comment: 'Great location and comfortable bed. The amenities were top-notch. Would definitely stay again.',
      date: '2024-01-08'
    },
    {
      id: '3',
      guestName: 'Emma Davis',
      rating: 5,
      comment: 'Perfect for a romantic getaway. The room service was excellent and the ambiance was perfect.',
      date: '2024-01-05'
    }
  ];

  const mockFeatures = [
    'King-size bed with premium linens',
    'Marble bathroom with rainfall shower',
    'Floor-to-ceiling windows',
    'Work desk with ergonomic chair',
    '24/7 room service',
    'Complimentary breakfast',
    'Daily housekeeping',
    'Concierge service'
  ];

  const mockNearbyAttractions = [
    'City Center - 0.5 miles',
    'Art Museum - 0.8 miles',
    'Shopping District - 1.2 miles',
    'Beach - 2.5 miles',
    'Airport - 15 miles'
  ];

  useEffect(() => {
    const foundRoom = rooms.find(r => r.id === roomId);
    if (foundRoom) {
      setRoom(foundRoom);
    }
    setLoading(false);
  }, [roomId, rooms]);

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wi-fi') || amenityLower.includes('wifi')) return <Wifi className="h-5 w-5" />;
    if (amenityLower.includes('tv')) return <Tv className="h-5 w-5" />;
    if (amenityLower.includes('air') || amenityLower.includes('conditioning')) return <Wind className="h-5 w-5" />;
    if (amenityLower.includes('parking')) return <Car className="h-5 w-5" />;
    if (amenityLower.includes('service') || amenityLower.includes('coffee')) return <Coffee className="h-5 w-5" />;
    if (amenityLower.includes('bath') || amenityLower.includes('jacuzzi')) return <Bath className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-amber-600 fill-current' : 'text-neutral-300'}`}
      />
    ));
  };

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  // Check if current user can checkout this room
  const canCheckout = user && room && (user.id === room.guestId || user.role === 'admin');
  const isCurrentUserBooking = user && room && user.id === room.guestId;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4 uppercase tracking-wide">Room Not Found</h2>
          <button
            onClick={onBack}
            className="bg-neutral-900 text-white px-6 py-3 font-medium hover:bg-neutral-800 transition-colors uppercase tracking-wide"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium uppercase tracking-wide"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Rooms</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-neutral-400 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white border border-neutral-200 overflow-hidden">
              <div className="relative">
                <img
                  src={mockImages[selectedImageIndex]}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-96 object-cover"
                />
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
                <div className="absolute top-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center space-x-2 border border-white/20">
                    <Camera className="h-4 w-4 text-neutral-600" />
                    <span className="text-neutral-800 text-xs font-semibold">{mockImages.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3">
                  {mockImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index ? 'ring-2 ring-neutral-900' : 'hover:opacity-75'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Room view ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-white border border-neutral-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2 uppercase tracking-wide">
                    Room {room.roomNumber}
                  </h1>
                  <div className="flex items-center space-x-4 text-neutral-600">
                    <span className="font-medium uppercase tracking-wide">{room.type} Room</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(averageRating))}
                      <span className="text-sm font-medium">({mockReviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-neutral-900">${room.price}</div>
                  <div className="text-neutral-500 uppercase tracking-wider text-sm font-medium">per night</div>
                </div>
              </div>

              <p className="text-neutral-700 text-lg leading-relaxed mb-6">
                {room.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Users className="h-5 w-5 text-neutral-900" />
                  <span className="uppercase tracking-wide text-sm font-medium">2-4 Guests</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-600">
                  <MapPin className="h-5 w-5 text-neutral-900" />
                  <span className="uppercase tracking-wide text-sm font-medium">City View</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Clock className="h-5 w-5 text-neutral-900" />
                  <span className="uppercase tracking-wide text-sm font-medium">24/7 Service</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-600">
                  <CheckCircle className="h-5 w-5 text-neutral-900" />
                  <span className="uppercase tracking-wide text-sm font-medium">Free Cancellation</span>
                </div>
              </div>

              {/* Guest Info (if booked) */}
              {room.isBooked && room.guestName && (
                <div className="bg-neutral-50 border border-neutral-200 p-4 mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-2 uppercase tracking-wide">Current Booking</h3>
                  <div className="text-neutral-700 space-y-1">
                    <p><strong className="uppercase tracking-wide text-xs text-neutral-500">Guest:</strong> {room.guestName}</p>
                    <p><strong className="uppercase tracking-wide text-xs text-neutral-500">Check-in:</strong> {room.checkInDate ? new Date(room.checkInDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong className="uppercase tracking-wide text-xs text-neutral-500">Check-out:</strong> {room.checkOutDate ? new Date(room.checkOutDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 uppercase tracking-wide">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-neutral-900">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-neutral-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 uppercase tracking-wide">Room Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Nearby */}
            <div className="bg-white border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6 uppercase tracking-wide">Location & Nearby</h2>
              <div className="space-y-3">
                {mockNearbyAttractions.map((attraction, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-neutral-900 flex-shrink-0" />
                    <span className="text-neutral-700 font-medium">{attraction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wide">Guest Reviews</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-lg font-bold text-neutral-900">{averageRating.toFixed(1)}</span>
                  <span className="text-neutral-500 font-medium">({mockReviews.length} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-neutral-900 uppercase tracking-wide">{review.guestName}</h4>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-neutral-500 font-medium">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-neutral-200 p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-neutral-900 mb-1">${room.price}</div>
                  <div className="text-neutral-500 uppercase tracking-wider text-sm font-medium">per night</div>
                </div>

                {room.isBooked ? (
                  <div className="text-center">
                    <div className="bg-neutral-50 border border-neutral-200 p-4 mb-4">
                      <h3 className="font-bold text-neutral-900 mb-2 uppercase tracking-wide">Currently Occupied</h3>
                      <p className="text-neutral-600 text-sm">
                        {canCheckout 
                          ? (isCurrentUserBooking ? 'You have booked this room' : 'You can checkout this room as admin')
                          : 'This room is not available for booking'
                        }
                      </p>
                    </div>
                    {canCheckout ? (
                      <button
                        onClick={() => {/* Add checkout logic here */}}
                        className="w-full bg-red-600 text-white py-3 px-4 font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
                      >
                        <MapPin className="h-5 w-5" />
                        <span>{user?.role === 'admin' && !isCurrentUserBooking ? 'Admin Checkout' : 'Check Out'}</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-neutral-400 text-white py-3 px-4 font-semibold cursor-not-allowed uppercase tracking-wide"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-neutral-900 text-white py-3 px-4 font-semibold hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Book This Room</span>
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="font-bold text-neutral-900 mb-4 uppercase tracking-wide">Need Help?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-neutral-600">
                      <Phone className="h-4 w-4 text-neutral-900" />
                      <span className="text-sm font-medium">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-neutral-600">
                      <Mail className="h-4 w-4 text-neutral-900" />
                      <span className="text-sm font-medium">info@myorison.com</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Free cancellation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold uppercase tracking-wide">No booking fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        room={room}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
};

export default RoomDetailsPage;