import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { RoomFilters as RoomFiltersType, RoomType } from '../../types/room';

interface RoomFiltersProps {
  onFilterChange: (filters: RoomFiltersType) => void;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);

  const roomTypes: RoomType[] = ['single', 'double', 'suite', 'deluxe'];

  const handleFilterChange = (key: keyof RoomFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by room number, type, or description..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors duration-200 ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
              {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Room Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {roomTypes.map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={filters.available?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('available', value === '' ? undefined : value === 'true');
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Rooms</option>
                <option value="true">Available Only</option>
                <option value="false">Booked Only</option>
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price ($)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomFilters;