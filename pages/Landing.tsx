import React, { useState } from 'react';
import { RoutePaths } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, Camera, Eye, ArrowRight, ScanFace, Sparkles, Download, Search } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [eventQuery, setEventQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter events
    navigate(RoutePaths.APP_GALLERY);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-20 pb-24 lg:pt-32 lg:pb-40">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
             <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-500 blur-3xl"></div>
             <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
             <div className="absolute bottom-0 left-1/2 w-full h-64 bg-gradient-to-t from-slate-900 to-transparent"></div>
         </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 animate-in slide-in-from-bottom-4 duration-700">
            Your Event. Your Memories. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Instantly.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Find your event by date or name, or let our secure AI find you in seconds.
          </p>
          
          {/* Main Action: Search Events */}
          <div className="max-w-md mx-auto mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text"
                value={eventQuery}
                onChange={(e) => setEventQuery(e.target.value)}
                placeholder="Search event name (e.g. Sunset Soirée)..."
                className="w-full bg-white/10 backdrop-blur-md border border-slate-600 text-white placeholder-slate-400 rounded-full py-4 pl-6 pr-14 outline-none focus:border-brand-500 focus:bg-white/20 transition-all shadow-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-500 transition-colors shadow-lg"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Secondary Action: Find Me */}
          <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to={RoutePaths.APP_GALLERY} className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium hover:underline">
              <Camera className="w-4 h-4 mr-2" />
              Or search by selfie
            </Link>
          </div>

        </div>
      </section>

      {/* Feature Steps (Detailed) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                 <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How it Works</h2>
                 <p className="text-lg text-slate-600 max-w-2xl mx-auto">Instant access to your professional event photos.</p>
            </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-brand-200 group-hover:shadow-md transition-all relative z-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <ScanFace size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">1</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Find Your Face</h3>
              <p className="text-slate-600 leading-relaxed px-4">
                Search by event name, date, or try our secure Selfie Search to find your photos instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-brand-200 group-hover:shadow-md transition-all relative z-10">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">2</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Choose a Theme</h3>
              <p className="text-slate-600 leading-relaxed px-4">
                Purchase the perfect original photo, or use Credits to remix it into magical AI scenarios.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-brand-200 group-hover:shadow-md transition-all relative z-10">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <Download size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">3</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Download & Keep</h3>
              <p className="text-slate-600 leading-relaxed px-4">
                Instant high-resolution digital downloads. Print-ready quality delivered to your inbox.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;