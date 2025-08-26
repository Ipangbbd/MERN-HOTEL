import React, { useState } from 'react';
import { X, Calendar, User, CreditCard } from 'lucide-react';
import { Room } from '../../types/room';
import { useRoomContext } from '../../context/RoomContext';
import { showToast } from '../UI/Toaster';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, isOpen, onClose }) => {
  const { bookRoom } = useRoomContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    checkInDate: '',
    checkOutDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    // Validation
    if (!formData.guestName.trim()) {
      showToast('Please enter guest name', 'error');
      return;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      showToast('Please select check-in and check-out dates', 'error');
      return;
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      showToast('Check-out date must be after check-in date', 'error');
      return;
    }

    if (new Date(formData.checkInDate) < new Date()) {
      showToast('Check-in date cannot be in the past', 'error');
      return;
    }

    setLoading(true);
    try {
      await bookRoom(room.id, formData);
      showToast('Room booked successfully!', 'success');
      onClose();
      setFormData({ guestName: '', checkInDate: '', checkOutDate: '' });
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalPrice = room ? calculateNights() * room.price : 0;

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-neutral-200 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wide">
            Book Room {room.roomNumber}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 transition-colors duration-200 group"
          >
            <X className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700" />
          </button>
        </div>

        {/* Room Info */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex space-x-4">
            <img
              src={room.imageUrl || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
              alt={`Room ${room.roomNumber}`}
              className="w-20 h-20 object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-neutral-900 uppercase tracking-wide mb-1">
                {room.type} Room
              </h3>
              <p className="text-sm text-neutral-600 mb-3 leading-relaxed">{room.description}</p>
              <div className="text-xl font-bold text-neutral-900">${room.price}/night</div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Guest Name */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                <User className="h-4 w-4" />
                <span>Guest Name</span>
              </label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
                required
              />
            </div>

            {/* Check-in Date */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                <Calendar className="h-4 w-4" />
                <span>Check-in Date</span>
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
                required
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                <Calendar className="h-4 w-4" />
                <span>Check-out Date</span>
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                className="w-full border border-neutral-300 px-4 py-3 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors text-neutral-900 font-medium"
                required
              />
            </div>

            {/* Booking Summary */}
            {calculateNights() > 0 && (
              <div className="bg-neutral-50 border border-neutral-200 p-4">
                <h4 className="font-bold text-neutral-900 mb-3 uppercase tracking-wide">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm text-neutral-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{calculateNights()} nights</span>
                    <span className="font-medium">${room.price} × {calculateNights()}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t border-neutral-300 pt-3 text-neutral-900">
                    <span className="uppercase tracking-wide">Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-4 px-6 font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 uppercase tracking-wide"
            >
              <CreditCard className="h-5 w-5" />
              <span>{loading ? 'Booking...' : 'Book Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;