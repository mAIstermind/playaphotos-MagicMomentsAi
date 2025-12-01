import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { RoutePaths } from '../types';
import { LayoutDashboard, Images, Settings, LogOut, Menu, X, Camera } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface LayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar layoutType="public" />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar layoutType="app" />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Helper for active link styling
  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
      isActive
        ? 'bg-brand-600 text-white shadow-md'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* SIDEBAR (Desktop Fixed) */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white flex-shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="bg-brand-600 p-1.5 rounded-lg mr-3">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-wide">Agency Portal</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <Link to={RoutePaths.ADMIN_DASHBOARD} className={getLinkClass(RoutePaths.ADMIN_DASHBOARD)}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link to={RoutePaths.ADMIN_EVENTS} className={getLinkClass(RoutePaths.ADMIN_EVENTS)}>
            <Images size={20} />
            <span className="font-medium">Galleries</span>
          </Link>

          <div className="my-4 border-t border-slate-800 mx-2"></div>

          <Link to={RoutePaths.ADMIN_SETTINGS} className={getLinkClass(RoutePaths.ADMIN_SETTINGS)}>
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <Link to={RoutePaths.HOME} className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50">
         <div className="flex items-center space-x-2">
           <Camera className="w-6 h-6 text-brand-500" />
           <span className="font-bold">Agency Portal</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
           <div className="w-64 bg-slate-900 h-full p-4 pt-20 space-y-2 shadow-xl">
              <Link to={RoutePaths.ADMIN_DASHBOARD} onClick={() => setMobileMenuOpen(false)} className={getLinkClass(RoutePaths.ADMIN_DASHBOARD)}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to={RoutePaths.ADMIN_EVENTS} onClick={() => setMobileMenuOpen(false)} className={getLinkClass(RoutePaths.ADMIN_EVENTS)}>
                <Images size={20} />
                <span>Galleries</span>
              </Link>
              <Link to={RoutePaths.ADMIN_SETTINGS} onClick={() => setMobileMenuOpen(false)} className={getLinkClass(RoutePaths.ADMIN_SETTINGS)}>
                <Settings size={20} />
                <span>Settings</span>
              </Link>
           </div>
           <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:static pt-16 md:pt-0">
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
           {children}
        </main>
      </div>

    </div>
  );
};