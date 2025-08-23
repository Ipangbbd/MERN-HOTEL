import React from 'react';
import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Hotel Booking System</h3>
                <p className="text-gray-400 text-sm">Premium Room Management</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Experience luxury and comfort with our state-of-the-art hotel booking system. 
              Book your perfect room with real-time availability and seamless service.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">info@hotelbook.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">123 Hotel Street, City</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Services</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Hotel Booking System. All rights reserved. Built with React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;