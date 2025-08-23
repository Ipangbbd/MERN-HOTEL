import React from 'react';
import { Calendar, Users, Bed, TrendingUp } from 'lucide-react';
import { useRoomContext } from '../../context/RoomContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const Hero: React.FC = () => {
  const { stats, loading } = useRoomContext();

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Luxury Hotel
              <span className="block text-blue-200">Booking System</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Experience premium hospitality with our state-of-the-art booking system. 
              Real-time availability, seamless reservations, and exceptional service.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-200">
                View Rooms
              </button>
            </div>
          </div>

          {/* Live Stats Dashboard */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-center">Live Availability Dashboard</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mx-auto mb-3">
                    <Bed className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stats.available}</div>
                  <div className="text-blue-200">Available Rooms</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mx-auto mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stats.booked}</div>
                  <div className="text-blue-200">Booked Rooms</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-blue-200">Total Rooms</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stats.occupancyRate}%</div>
                  <div className="text-blue-200">Occupancy</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-200">Unable to load stats</p>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200">Last updated:</span>
                <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;