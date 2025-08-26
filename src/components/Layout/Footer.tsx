import React from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Rooms & Suites', href: '/rooms' },
    { label: 'Dining', href: '/dining' },
    { label: 'Wellness & Spa', href: '/wellness' },
    { label: 'Meetings & Events', href: '/events' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'About Us', href: '/about' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' }
  ];

  const socialLinks = [
    { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="flex flex-col space-y-6">
                <div>
                  <span className="text-2xl font-bold text-white">
                    my<span className="text-amber-500">/</span>orison
                  </span>
                  <div className="text-xs text-neutral-400 font-medium tracking-wider uppercase mt-1">
                    Hospitality
                  </div>
                </div>
                
                <p className="text-neutral-300 text-sm leading-relaxed max-w-md">
                  Redefining luxury hospitality through exceptional service, thoughtful design, 
                  and unforgettable experiences. Where every stay becomes a cherished memory.
                </p>

                {/* Social Media */}
                <div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                    Follow Us
                  </div>
                  <div className="flex space-x-3">
                    {socialLinks.map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors duration-200 group"
                        aria-label={label}
                      >
                        <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Explore
              </div>
              <nav className="space-y-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-neutral-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-4">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Get In Touch
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-neutral-300">
                    <div>123 Heritage Boulevard</div>
                    <div>Jakarta 12345, Indonesia</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <a 
                    href="tel:+62211234567"
                    className="text-sm text-neutral-300 hover:text-white transition-colors"
                  >
                    +62 21 1234 567
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <a 
                    href="mailto:hello@myorison.com"
                    className="text-sm text-neutral-300 hover:text-white transition-colors"
                  >
                    hello@myorison.com
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Newsletter
                </div>
                <form className="flex" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-neutral-800 text-white text-sm border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-neutral-400">
              © {currentYear} my/orison Hospitality. All rights reserved.
            </div>

            {/* Legal Links */}
            <nav className="flex flex-wrap justify-center md:justify-end space-x-6">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;