import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {FaTimes, FaBars} from 'react-icons/fa';
import { navItems } from '../../constants/navItems';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-primary font-bold text-xl flex items-center gap-2">
          <span className="text-2xl">🏠</span> IntelliInsights
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-2 px-2 py-1 text-sm font-medium ${
                isActive(item.path)
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-primary'
              }`}
            >
              {<item.icon/>} {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-primary focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 border-b text-sm font-medium ${
                isActive(item.path)
                  ? 'text-primary border-primary'
                  : 'text-gray-700 hover:text-primary hover:border-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                {<item.icon/>} {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
