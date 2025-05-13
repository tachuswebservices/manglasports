
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`${isDark ? 'bg-mangla' : 'bg-slate-900'} pt-16 pb-8 ${isDark ? 'border-gray-800' : 'border-gray-700'} border-t`}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <span className="text-mangla-gold font-montserrat font-bold text-2xl">MANGLA SPORTS</span>
            </Link>
            <p className="text-gray-400 mb-6">
              India's premier destination for high-quality shooting sports equipment and expertise.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-mangla-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-mangla-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-mangla-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-mangla-gold transition-colors">Home</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">Products</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Products</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">Precision Rifles</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">Performance Handguns</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">Advanced Optics</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-mangla-gold transition-colors">Essential Accessories</Link></li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mangla-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-400">+91 1234567890</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mangla-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400">info@manglasports.com</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-mangla-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">123 Shooting Avenue, <br />New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="pt-8 border-t border-gray-800 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Mangla Sports. All Rights Reserved.</p>
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-500 hover:text-mangla-gold transition-colors text-sm">Privacy Policy</Link>
              <Link to="#" className="text-gray-500 hover:text-mangla-gold transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
