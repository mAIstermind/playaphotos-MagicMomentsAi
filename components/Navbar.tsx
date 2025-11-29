import React, { useState } from 'react';
import { Menu, X, Camera, LayoutDashboard, Image } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { RoutePaths } from '../types';

interface NavbarProps {
  layoutType: 'public' | 'app' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({ layoutType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const renderBrand = () => (
    <Link to={RoutePaths.HOME} onClick={closeMenu} className="flex items-center space-x-2 group">
      <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
        <Camera className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
        Playa Photos
      </span>
    </Link>
  );

  const renderLinks = (mobile = false) => {
    const baseClass = mobile
      ? "flex flex-col space-y-4 p-6 text-lg font-medium text-slate-600 bg-white"
      : "flex items-center space-x-8 text-sm font-medium text-slate-600";

    const linkClass = "hover:text-brand-600 transition-colors flex items-center space-x-2 py-1";
    const activeLinkClass = "text-brand-600 font-semibold flex items-center space-x-2 py-1";

    const getLinkClass = (path: string) => location.pathname === path ? activeLinkClass : linkClass;

    if (layoutType === 'admin') {
      return (
        <div className={baseClass}>
          <Link to={RoutePaths.ADMIN_DASHBOARD} className={getLinkClass(RoutePaths.ADMIN_DASHBOARD)} onClick={closeMenu}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link to={RoutePaths.HOME} className={linkClass} onClick={closeMenu}>Logout</Link>
        </div>
      );
    }

    if (layoutType === 'app') {
      return (
        <div className={baseClass}>
          <Link to={RoutePaths.APP_GALLERY} className={getLinkClass(RoutePaths.APP_GALLERY)} onClick={closeMenu}>
            <Image className="w-4 h-4" />
            <span>Gallery</span>
          </Link>
          <div className={`${mobile ? 'w-full' : ''}`}>
             <button className="w-full bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition-all shadow-md flex items-center justify-center space-x-2">
               <span>0 Credits</span>
            </button>
          </div>
        </div>
      );
    }

    // Public Layout
    return (
      <div className={baseClass}>
        <Link to={RoutePaths.HOME} className={getLinkClass(RoutePaths.HOME)} onClick={closeMenu}>Home</Link>
        <Link to={RoutePaths.FEATURES} className={getLinkClass(RoutePaths.FEATURES)} onClick={closeMenu}>Features</Link>
        <Link to={RoutePaths.PRICING} className={getLinkClass(RoutePaths.PRICING)} onClick={closeMenu}>Pricing</Link>
        {/* Agency Login Removed from main nav */}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            {renderBrand()}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex">
            {renderLinks()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-slate-600 hover:text-brand-600 focus:outline-none p-2 rounded-md active:bg-slate-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
          {renderLinks(true)}
        </div>
      )}
    </nav>
  );
};