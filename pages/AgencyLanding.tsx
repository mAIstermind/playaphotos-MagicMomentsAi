import React from 'react';
import { RoutePaths } from '../types';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle, BarChart3, Lock } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const AgencyLanding: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Agency Hero */}
      <section className="bg-white pt-20 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wide mb-6">
            For Event Photographers
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Monetize your event photos <br className="hidden md:block"/> with AI-powered upselling.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">
            A white-label platform that turns attendees into customers. Offer digital downloads, prints, and AI remixes automatically.
          </p>
          <div className="flex justify-center gap-4">
             <Link to={RoutePaths.LOGIN} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
               Agency Login / Portal
             </Link>
             <Link to={RoutePaths.PRICING} className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-all">
               View Pricing
             </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                     <Camera />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Zero-Work Fulfillment</h3>
                  <p className="text-slate-500">We handle the hosting, face-search, payments, and delivery. You just upload the photos.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                     <BarChart3 />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Instant Revenue</h3>
                  <p className="text-slate-500">Direct payouts via Stripe Connect. Set your own prices for downloads and prints.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                     <Lock />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Private & Secure</h3>
                  <p className="text-slate-500">Enterprise-grade security with local browser-based face search technology.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AgencyLanding;