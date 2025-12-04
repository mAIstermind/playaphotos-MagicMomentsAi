
import React, { useState, useEffect } from 'react';
import { RoutePaths } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, Camera, Download, Search, ArrowRight, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'; // Import Firestore
import { db } from '../lib/firebase';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [eventQuery, setEventQuery] = useState('');
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Query: Get active events (Limit to 6)
        const q = query(
          collection(db, 'events'),
          where('status', '==', 'active'),
          limit(6)
        );
        const snapshot = await getDocs(q);
        // Note: In a real app, we'd also fetch the cover image for each
        setRecentEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, simpler search: Just alert user to look below
    alert("Please browse the featured events below!");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-500 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Your Event. Your Memories. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Instantly.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-10">
            Find your event below or search by name. Secure, fast, and AI-powered.
          </p>
          
          <div className="max-w-md mx-auto mb-6">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text"
                value={eventQuery}
                onChange={(e) => setEventQuery(e.target.value)}
                placeholder="Search event name..."
                className="w-full bg-white/10 backdrop-blur-md border border-slate-600 text-white placeholder-slate-400 rounded-full py-4 pl-6 pr-14 outline-none focus:border-brand-500 transition-all"
              />
              <button type="submit" className="absolute right-2 top-2 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-500 transition-colors">
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED GALLERIES (THE MISSING PIECE) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
             <h2 className="text-2xl font-bold text-slate-900">Featured Galleries</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-600" /></div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-500">No public events active right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <Link key={event.id} to={`/gallery/${event.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100">
                  <div className="h-48 bg-slate-200 relative flex items-center justify-center">
                     <Camera className="w-12 h-12 text-slate-300" />
                     {/* If you had a coverImage, you would render it here */}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">{event.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{event.date}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-brand-600">
                      View Photos <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Steps */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">How it Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6"><Camera size={32} /></div>
              <h3 className="text-xl font-bold mb-2">1. Find Your Face</h3>
              <p className="text-slate-600">Use our secure AI to find your photos instantly.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6"><Wand2 size={32} /></div>
              <h3 className="text-xl font-bold mb-2">2. AI Remix</h3>
              <p className="text-slate-600">Transform your photo into magical scenarios.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6"><Download size={32} /></div>
              <h3 className="text-xl font-bold mb-2">3. Keep Forever</h3>
              <p className="text-slate-600">Purchase high-res downloads instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;