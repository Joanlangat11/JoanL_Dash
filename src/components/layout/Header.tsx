import React from 'react';
import { Menu, Plane as Plant } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Plant size={28} className="text-green-300" />
          <h1 className="text-xl md:text-2xl font-bold">Farmers Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-green-200 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-green-200 hover:text-white transition-colors">Reports</a>
            <a href="#" className="text-green-200 hover:text-white transition-colors">Help</a>
          </nav>
          
          <div className="hidden md:block">
            <button className="bg-white text-green-800 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-white">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;