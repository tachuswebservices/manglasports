import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <img src="/lovable-uploads/msa-logo.png" alt="Logo" className="h-8 w-auto" />
        <span className="font-bold text-lg tracking-wide">Admin Panel</span>
      </div>
      <div className="flex gap-4">
        <Link to="/admin" className="hover:text-mangla-gold font-medium">Dashboard</Link>
        <Link to="/admin" className="hover:text-mangla-gold font-medium">Products</Link>
        {/* Add more admin links as needed */}
      </div>
    </nav>
  );
};

export default AdminNavbar; 