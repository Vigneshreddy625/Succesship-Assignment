import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition-colors">
          Profile
        </a>

        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-400 transition-colors">Home</a>
          <a href="#" className="hover:text-gray-400 transition-colors">About</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Services</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
        </nav>

        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 mt-4 rounded-lg shadow-md p-4 space-y-2 text-center">
          <a href="#" className="block py-2 hover:bg-gray-600 rounded-md transition-colors">Home</a>
          <a href="#" className="block py-2 hover:bg-gray-600 rounded-md transition-colors">About</a>
          <a href="#" className="block py-2 hover:bg-gray-600 rounded-md transition-colors">Services</a>
          <a href="#" className="block py-2 hover:bg-gray-600 rounded-md transition-colors">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;