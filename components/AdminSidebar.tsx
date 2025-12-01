import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Settings, LogOut, Menu, X, Camera } from 'lucide-react';
import { RoutePaths } from '../types';

export const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavItem = ({ path, icon: Icon, label }: { path: string; icon: any; label: string }) => {
    const isActive = location.pathname.startsWith(path);
    return (
      <Link
        to={path}
        onClick={() => setIsOpen(false)}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-brand-50 text-brand-700 font-medium' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center space-x-2">
           <div className="bg-brand-600 p-1.5 rounded-md">
             <Camera className="w-5 h-5 text-white" />
           </div>
           <span className="font-bold text-slate-900">Agency Portal</span>
        </div>
        <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-900">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 hidden md:flex">
             <div className="bg-brand-600 p-1.5 rounded-lg mr-3">
               <Camera className="w-5 h-5 text-white" />
             </div>
             <span className="text-lg font-bold text-slate-900">Agency Portal</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavItem path={RoutePaths.ADMIN_DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem path={RoutePaths.ADMIN_EVENTS} icon={FolderOpen} label="Galleries" />
            
            {/* Placeholder for future settings */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
              <NavItem path="/admin/settings" icon={Settings} label="Settings" />
            </div>
          </nav>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-slate-100">
            <Link 
              to={RoutePaths.HOME} 
              className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};