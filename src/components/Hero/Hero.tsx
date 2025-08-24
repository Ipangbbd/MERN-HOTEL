import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Users, MapPin, Percent } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('24/08/2025');
  const [checkOut, setCheckOut] = useState('25/08/2025');
  const [rooms, setRooms] = useState('1');
  const [promoCode, setPromoCode] = useState('');

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Enjoy The Best Moments Of Life'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Luxury Redefined'
    },
    {
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Comfort Beyond Compare'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCheckAvailability = () => {
    console.log('Checking availability...', { checkIn, checkOut, rooms, promoCode });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">
                my<span className="text-amber-600">/</span>orison.com
              </span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">HOME</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">OFFERS</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">LOYALTY PROGRAMME</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">ABOUT US</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">CAREER</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-30 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide mb-8 leading-tight">
              {slides[currentSlide].title}
            </h1>
          </div>
        </div>

        {/* Booking Form */}
        <div className="absolute bottom-0 left-0 right-0 z-40 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Destination */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City, Hotel"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                      defaultValue=""
                    />
                  </div>
                </div>

                {/* Check In/Out */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Check In/Check Out
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={`${checkIn} - ${checkOut}`}
                      onChange={(e) => {
                        const dates = e.target.value.split(' - ');
                        if (dates.length === 2) {
                          setCheckIn(dates[0]);
                          setCheckOut(dates[1]);
                        }
                      }}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Rooms
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 appearance-none"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                </div>

                {/* Promotion Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Promotion Code
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder=""
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button
                    onClick={handleCheckAvailability}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 uppercase tracking-wide"
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;