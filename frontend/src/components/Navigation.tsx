import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, Home, Heart, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            to="/diet"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/diet') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-xs mt-1">Diet</span>
          </Link>
          
          <Link
            to="/health"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/health') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs mt-1">Health</span>
          </Link>
          
          <Link
            to="/profile"
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive('/profile') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
