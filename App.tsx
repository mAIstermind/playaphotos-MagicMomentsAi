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

const AdminDashboardPlaceholder = () => (
  <div>
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Agency Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-900">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">$0.00</p>
       </div>
       <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 className="font-semibold text-purple-900">AI Generations</h3>
          <p className="text-3xl font-bold text-purple-700 mt-2">0</p>
       </div>
       <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900">Active Events</h3>
          <p className="text-3xl font-bold text-slate-700 mt-2">1</p>
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

        {/* Admin Routes */}
        <Route path={RoutePaths.ADMIN_DASHBOARD} element={<AdminLayout><AdminDashboardPlaceholder /></AdminLayout>} />
        
        {/* Safety Redirect for old selfie links */}
        <Route path="/selfie" element={<Navigate to={RoutePaths.APP_GALLERY} replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={RoutePaths.HOME} replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;