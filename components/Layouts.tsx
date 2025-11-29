import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

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
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar layoutType="admin" />
      <div className="flex flex-grow">
        {/* Placeholder for Sidebar could go here */}
        <main className="flex-grow p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};