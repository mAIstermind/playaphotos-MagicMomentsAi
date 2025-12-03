import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../types';
import { Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch event to InstallPwa component
    window.dispatchEvent(new Event('pwa-install-trigger'));
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          <div className="text-slate-500 text-sm">
            © {year} Playa Photos. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
            <button 
              onClick={handleInstallClick} 
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
            >
              <Download size={16} />
              <span>Install App</span>
            </button>
            
            <Link to={RoutePaths.PRIVACY} className="hover:text-brand-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to={RoutePaths.TERMS} className="hover:text-brand-600 transition-colors">
              Terms of Service
            </Link>
            <Link to={RoutePaths.AGENCY_LANDING} className="hover:text-brand-600 transition-colors">
              Agency Partner Program
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};