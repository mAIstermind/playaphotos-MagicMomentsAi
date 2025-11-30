import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Calendar, Image as ImageIcon, Loader2, Search, ArrowRight } from 'lucide-react';
import { RoutePaths } from '../../types';

interface EventData {
  id: string;
  name: string;
  date: string;
  slug: string;
  photoCount: number;
  status: 'active' | 'archived' | 'draft';
}

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
         setLoading(false);
         return;
      }

      const q = query(
        collection(db, 'events'), 
        where('agencyId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedEvents: EventData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEvents.push({ id: doc.id, ...doc.data() } as EventData);
      });
      
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const slug = eventName.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      const docRef = await addDoc(collection(db, 'events'), {
        name: eventName,
        date: eventDate,
        slug: slug,
        agencyId: user.uid,
        status: 'active',
        photoCount: 0,
        createdAt: serverTimestamp()
      });

      const detailPath = RoutePaths.ADMIN_EVENT_DETAIL.replace(':eventId', docRef.id);
      navigate(detailPath);

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. See console.");
    } finally {
      setCreating(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Event Galleries</h1>
          <p className="text-slate-500">Create and manage your photo events</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-all shadow-md group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span className="font-medium">Create New Gallery</span>
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-slate-400">
            <ImageIcon size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No galleries yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Create your first event gallery to start uploading photos and selling memories.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
          >
            Create Gallery Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link 
              key={event.id}
              to={RoutePaths.ADMIN_EVENT_DETAIL.replace(':eventId', event.id)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>
                 <ImageIcon className="text-slate-300 w-16 h-16 group-hover:scale-110 group-hover:text-brand-500 transition-all duration-500" />
                 
                 <div className="absolute top-3 right-3">
                   <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide border shadow-sm ${
                      event.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                   }`}>
                      {event.status}
                   </span>
                 </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                 <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{event.name}</h3>
                 
                 <div className="flex items-center text-sm text-slate-500 mb-4">
                    <Calendar size={14} className="mr-1.5" />
                    {event.date}
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
                       {event.photoCount} Photos
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                       <ArrowRight size={16} />
                    </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <h3 className="text-xl font-bold text-slate-900">Create New Gallery</h3>
               <p className="text-slate-500 text-sm mt-1">Set up a new event folder</p>
             </div>
             <form onSubmit={handleCreate} className="p-6 space-y-5">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
                 <input 
                   type="text" 
                   required
                   value={eventName}
                   onChange={(e) => setEventName(e.target.value)}
                   placeholder="e.g. Smith Wedding"
                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Date</label>
                 <input 
                   type="date" 
                   required
                   value={eventDate}
                   onChange={(e) => setEventDate(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                 />
               </div>
               <div className="pt-2 flex justify-end space-x-3">
                 <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   disabled={creating}
                   className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors flex items-center shadow-lg disabled:opacity-70 disabled:shadow-none"
                 >
                   {creating ? (
                     <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Creating...
                     </>
                   ) : (
                     'Create Gallery'
                   )}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;