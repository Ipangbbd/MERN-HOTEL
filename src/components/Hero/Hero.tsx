import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Users, MapPin, Percent, Search } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 guests, 1 room');
  const [destination, setDestination] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Where luxury meets comfort',
      subtitle: 'Experience hospitality redefined at every touchpoint'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Crafted for the discerning guest',
      subtitle: 'Every detail curated for your perfect stay'
    },
    {
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Elegance in every moment',
      subtitle: 'Create memories that last a lifetime'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoSliding) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoSliding, slides.length]);

  const nextSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoSliding(false);
    setCurrentSlide(index);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching...', { destination, checkIn, checkOut, guests, promoCode });
  };

  // Format today's date
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    };

    if (!checkIn) setCheckIn(formatDate(today));
    if (!checkOut) setCheckOut(formatDate(tomorrow));
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Image Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 z-20">
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 leading-[1.1]">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white shadow-2xl border border-neutral-200/20">
              {/* Mobile-first responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
                
                {/* Destination */}
                <div className="p-4 lg:p-6">
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                    Where
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-6 text-neutral-900 placeholder-neutral-400 bg-transparent border-0 focus:ring-0 p-0 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="p-4 lg:p-6">
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                    Check in
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="date"
                      value={checkIn.split('/').reverse().join('-')}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setCheckIn(date.toLocaleDateString('en-GB'));
                      }}
                      className="w-full pl-6 text-neutral-900 bg-transparent border-0 focus:ring-0 p-0 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="p-4 lg:p-6">
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                    Check out
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="date"
                      value={checkOut.split('/').reverse().join('-')}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setCheckOut(date.toLocaleDateString('en-GB'));
                      }}
                      className="w-full pl-6 text-neutral-900 bg-transparent border-0 focus:ring-0 p-0 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="p-4 lg:p-6">
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                    Who
                  </label>
                  <div className="relative">
                    <Users className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-6 text-neutral-900 bg-transparent border-0 focus:ring-0 p-0 text-sm font-medium appearance-none"
                    >
                      <option value="1 guest, 1 room">1 guest, 1 room</option>
                      <option value="2 guests, 1 room">2 guests, 1 room</option>
                      <option value="3 guests, 1 room">3 guests, 1 room</option>
                      <option value="4 guests, 2 rooms">4 guests, 2 rooms</option>
                      <option value="6 guests, 3 rooms">6 guests, 3 rooms</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-4 lg:p-6">
                  <button
                    type="submit"
                    className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>

              {/* Promo Code Row */}
              {promoCode && (
                <div className="border-t border-neutral-200 p-4 lg:p-6">
                  <div className="flex items-center gap-3">
                    <Percent className="h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 text-sm text-neutral-900 placeholder-neutral-400 bg-transparent border-0 focus:ring-0 p-0"
                    />
                  </div>
                </div>
              )}
            </form>

            {/* Promo Code Toggle */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setPromoCode(promoCode ? '' : ' ')}
                className="text-sm text-white/70 hover:text-white underline decoration-dotted underline-offset-4"
              >
                {promoCode ? 'Hide promo code' : 'Have a promo code?'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;  