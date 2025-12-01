import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Plus, Calendar, Image as ImageIcon, Loader } from 'lucide-react';

const EventsManager = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchEvents(user);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchEvents = async (user: any) => {
    try {
      const q = query(collection(db, 'events'), where('agencyId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const eventsList = [];
      for (const doc of querySnapshot.docs) {
        const eventData = doc.data();
        let coverUrl = null;
        const photoQ = query(collection(db, 'photos'), where('eventId', '==', doc.id), limit(1));
        const photoSnapshot = await getDocs(photoQ);
        if (!photoSnapshot.empty) coverUrl = photoSnapshot.docs[0].data().originalUrl;
        eventsList.push({ id: doc.id, ...eventData, coverUrl });
      }
      setEvents(eventsList);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    const name = prompt("Enter Event Name:");
    if (!name || !auth.currentUser) return;
    const docRef = await addDoc(collection(db, 'events'), {
      name,
      agencyId: auth.currentUser.uid,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
      createdAt: serverTimestamp(),
      photoCount: 0
    });
    navigate(`/admin/events/${docRef.id}`);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Event Galleries</h1>
        <button onClick={handleCreate} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-slate-800"><Plus className="w-5 h-5" /> Create New Gallery</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.id} to={`/admin/events/${event.id}`} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md">
            <div className="h-48 bg-slate-100 relative">
              {event.coverUrl ? <img src={event.coverUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon className="w-12 h-12" /></div>}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1">{event.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm"><Calendar className="w-4 h-4" /> {event.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default EventsManager;