
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoutePaths } from './types';
import { PublicLayout, AppLayout, AdminLayout } from './components/Layouts';
import { AgencySidebarLayout } from './layouts/AgencySidebarLayout';
import { CartProvider } from './contexts/CartContext';
import { InstallPwa } from './components/InstallPwa';

// Pages
import Landing from './pages/Landing';
import AgencyLanding from './pages/AgencyLanding';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import EventGallery from './pages/EventGallery';
import Success from './pages/Success';
import EventsManager from './pages/admin/EventsManager';
import EventUploadManager from './pages/admin/EventUploadManager';
import Documentation from './pages/admin/Documentation';

// NEW: Real Marketing Pages
import Features from './pages/Features';
import Pricing from './pages/Pricing';

// Placeholder for Settings
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="py-24 text-center">
    <h1 className="text-4xl font-bold text-slate-300 mb-4">Coming Soon</h1>
    <p className="text-xl text-slate-500">{title}</p>
  </div>
);

const AdminDashboardPlaceholder = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Agency Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">Total Revenue</h3><p className="text-3xl font-bold text-slate-900 mt-2">$0.00</p></div>
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">AI Generations</h3><p className="text-3xl font-bold text-brand-600 mt-2">0</p></div>
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">Active Events</h3><p className="text-3xl font-bold text-indigo-600 mt-2">0</p></div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <CartProvider>
      <InstallPwa />
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path={RoutePaths.HOME} element={<PublicLayout><Landing /></PublicLayout>} />
          <Route path={RoutePaths.AGENCY_LANDING} element={<PublicLayout><AgencyLanding /></PublicLayout>} />
          <Route path={RoutePaths.LOGIN} element={<PublicLayout><Login /></PublicLayout>} />
          <Route path={RoutePaths.TERMS} element={<PublicLayout><Terms /></PublicLayout>} />
          <Route path={RoutePaths.PRIVACY} element={<PublicLayout><Privacy /></PublicLayout>} />
          
          {/* CONNECTED MARKETING PAGES */}
          <Route path={RoutePaths.PRICING} element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path={RoutePaths.FEATURES} element={<PublicLayout><Features /></PublicLayout>} />

          {/* APP ROUTES */}
          <Route path={RoutePaths.APP_GALLERY} element={<AppLayout><EventGallery /></AppLayout>} />
          <Route path={RoutePaths.EVENT_SLUG} element={<AppLayout><EventGallery /></AppLayout>} />
          <Route path={RoutePaths.CHECKOUT_SUCCESS} element={<PublicLayout><Success /></PublicLayout>} />

          {/* ADMIN ROUTES */}
          <Route path={RoutePaths.ADMIN_DASHBOARD} element={<AgencySidebarLayout><AdminDashboardPlaceholder /></AgencySidebarLayout>} />
          <Route path={RoutePaths.ADMIN_EVENTS} element={<AgencySidebarLayout><EventsManager /></AgencySidebarLayout>} />
          <Route path={RoutePaths.ADMIN_EVENT_DETAIL} element={<AgencySidebarLayout><EventUploadManager /></AgencySidebarLayout>} />
          <Route path="/admin/documentation" element={<AgencySidebarLayout><Documentation /></AgencySidebarLayout>} />
          <Route path="/admin/settings" element={<AgencySidebarLayout><PlaceholderPage title="Settings" /></AgencySidebarLayout>} />
          
          <Route path="/selfie" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to={RoutePaths.HOME} replace />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
};

export default App;