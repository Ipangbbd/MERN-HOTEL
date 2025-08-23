import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Save, X } from 'lucide-react';
import { useRoomContext } from '../../context/RoomContext';
import { Room, RoomType } from '../../types/room';
import { showToast } from '../UI/Toaster';
import LoadingSpinner from '../UI/LoadingSpinner';

const AdminPanel: React.FC = () => {
  const { rooms, stats, loading, createRoom, updateRoom, deleteRoom } = useRoomContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<RoomType | ''>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const roomTypes: RoomType[] = ['single', 'double', 'suite', 'deluxe'];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
        showToast('Room deleted successfully', 'success');
      } catch (error: any) {
        showToast(error.message, 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Administration</h1>
          <p className="text-gray-600">Manage rooms, bookings, and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-3xl font-bold text-green-600">{stats?.available || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Booked</p>
                <p className="text-3xl font-bold text-red-600">{stats?.booked || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.occupancyRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as RoomType | '')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {roomTypes.map(type => (
                  <option key={type} value={type} className="capitalize">{type}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Room</span>
            </button>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Rooms ({filteredRooms.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={room.imageUrl || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                              alt={`Room ${room.roomNumber}`}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Room {room.roomNumber}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {room.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${room.price}/night
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          room.isBooked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {room.isBooked ? 'Occupied' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.guestName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingRoom(room)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRooms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No rooms found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingRoom) && (
          <RoomModal
            room={editingRoom}
            isOpen={true}
            onClose={() => {
              setShowCreateModal(false);
              setEditingRoom(null);
            }}
            onSave={async (roomData) => {
              try {
                if (editingRoom) {
                  await updateRoom(editingRoom.id, roomData);
                  showToast('Room updated successfully', 'success');
                } else {
                  await createRoom(roomData);
                  showToast('Room created successfully', 'success');
                }
                setShowCreateModal(false);
                setEditingRoom(null);
              } catch (error: any) {
                showToast(error.message, 'error');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

interface RoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: any) => Promise<void>;
}

const RoomModal: React.FC<RoomModalProps> = ({ room, isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    type: room?.type || 'single',
    price: room?.price || 0,
    description: room?.description || '',
    imageUrl: room?.imageUrl || '',
    amenities: room?.amenities.join(', ') || '',
  });

  const roomTypes: RoomType[] = ['single', 'double', 'suite', 'deluxe'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomNumber.trim() || !formData.description.trim() || formData.price <= 0) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const roomData = {
        ...formData,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0)
      };
      await onSave(roomData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {room ? 'Edit Room' : 'Create New Room'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number *
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {roomTypes.map(type => (
                  <option key={type} value={type} className="capitalize">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="Wi-Fi, TV, Air Conditioning, Mini Bar"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : (room ? 'Update Room' : 'Create Room')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;