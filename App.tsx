import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoutePaths } from './types';
import { PublicLayout, AppLayout, AdminLayout } from './components/Layouts';

// Pages
import Landing from './pages/Landing';
import AgencyLanding from './pages/AgencyLanding';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Gallery from './pages/Gallery';
import EventsManager from './pages/admin/EventsManager';
import EventUploadManager from './pages/admin/EventUploadManager';

const AdminDashboardPlaceholder = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Agency Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">$0.00</p>
       </div>
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">AI Generations</h3>
          <p className="text-3xl font-bold text-brand-600 mt-2">0</p>
       </div>
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider">Active Events</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">0</p>
       </div>
    </div>
  </div>
);

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="py-24 text-center">
    <h1 className="text-4xl font-bold text-slate-300 mb-4">Coming Soon</h1>
    <p className="text-xl text-slate-500">{title}</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={RoutePaths.HOME} element={<PublicLayout><Landing /></PublicLayout>} />
        <Route path={RoutePaths.AGENCY_LANDING} element={<PublicLayout><AgencyLanding /></PublicLayout>} />
        <Route path={RoutePaths.LOGIN} element={<PublicLayout><Login /></PublicLayout>} />
        <Route path={RoutePaths.TERMS} element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path={RoutePaths.PRIVACY} element={<PublicLayout><Privacy /></PublicLayout>} />
        
        {/* Placeholders for new links */}
        <Route path={RoutePaths.PRICING} element={<PublicLayout><PlaceholderPage title="Pricing Plans" /></PublicLayout>} />
        <Route path={RoutePaths.FEATURES} element={<PublicLayout><PlaceholderPage title="All Features" /></PublicLayout>} />

        {/* App/Event Routes */}
        <Route path={RoutePaths.APP_GALLERY} element={<AppLayout><Gallery /></AppLayout>} />

        {/* Admin Routes - Wrapped in AdminLayout */}
        <Route path={RoutePaths.ADMIN_DASHBOARD} element={<AdminLayout><AdminDashboardPlaceholder /></AdminLayout>} />
        <Route path={RoutePaths.ADMIN_EVENTS} element={<AdminLayout><EventsManager /></AdminLayout>} />
        
        {/* CRITICAL: Connect the Real Upload Manager */}
        <Route path={RoutePaths.ADMIN_EVENT_DETAIL} element={<AdminLayout><EventUploadManager /></AdminLayout>} />
        
        <Route path="/admin/settings" element={<AdminLayout><PlaceholderPage title="Agency Settings" /></AdminLayout>} />
        
        {/* Safety Redirect for old selfie links */}
        <Route path="/selfie" element={<Navigate to={RoutePaths.APP_GALLERY} replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={RoutePaths.HOME} replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;