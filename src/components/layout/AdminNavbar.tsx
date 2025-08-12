import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, LogOut } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <img src="/lovable-uploads/msa-logo.png" alt="Logo" className="h-8 w-auto" />
        {/* <span className="font-bold text-lg tracking-wide">Admin Panel</span> */}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:text-mangla-gold font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Website
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-red-400 font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar; 